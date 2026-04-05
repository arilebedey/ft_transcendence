import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProfilePopup } from "@/components/profile/EditProfilePopup";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { UserInfo } from "@/components/profile/UserInfo";
import { UserStats } from "@/components/profile/UserStats";
import { UserActionButton } from "@/components/profile/UserActionButton";
import { EditPreferencesPopup } from "@/components/profile/EditPreferencesPopup";
import { FollowListModal } from "@/components/profile/FollowListModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getFollowStats,
  profileMeQueryKey,
  profileByNameQueryKey,
  type ProfileUserData,
  type PublicProfileData,
  updateProfileMe,
} from "@/lib/profile-api";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { api } from "@/lib/api";

interface UserCardProps {
  profile: ProfileUserData | PublicProfileData;
  isOwnProfile: boolean;
}

export function UserCard({ profile, isOwnProfile }: UserCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fallbackActionError = "Something went wrong. Please try again.";
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [bio, setBio] = useState(profile.bio ?? "");

  useEffect(() => {
    setBio(profile.bio ?? "");
  }, [profile.bio]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditPreferencesPopup, setShowEditPreferencesPopup] =
    useState(false);
  const [actionError, setActionError] = useState("");
  const [openFollowList, setOpenFollowList] = useState<
    "followers" | "following" | null
  >(null);
  const online = usePresenceStatus(profile.id, profile.online);

  useEffect(() => {
    if (isOwnProfile) {
      setLoadingFollow(false);
      setActionError("");
      return;
    }

    const fetchFollowState = async () => {
      setLoadingFollow(true);

      try {
        const data = await api.get<{ isFollowing: boolean }>(
          `/follows/${profile.id}/is-following`,
        );
        setIsFollowing(data.isFollowing);
        setActionError("");
      } catch {
        setIsFollowing(false);
        setActionError(fallbackActionError);
      } finally {
        setLoadingFollow(false);
      }
    };

    void fetchFollowState();
  }, [fallbackActionError, profile.id, isOwnProfile]);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchStats = async () => {
      try {
        const data = await getFollowStats(profile.id);
        setStats({ followers: data.followers, following: data.following });
      } catch {
        setActionError(fallbackActionError);
      }
    };

    void fetchStats();
  }, [fallbackActionError, profile?.id]);

  const onToggleFollow = async () => {
    if (loadingFollow) return;

    const nextIsFollowing = !isFollowing;
    const followersDelta = nextIsFollowing ? 1 : -1;

    setActionError("");
    setIsFollowing(nextIsFollowing);
    setStats((prev) => ({
      ...prev,
      followers: prev.followers + followersDelta,
    }));

    try {
      if (nextIsFollowing) {
        await api.post("/follows", { followingId: profile.id });
      } else {
        const response = await fetch("/api/follows", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: profile.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow user");
        }
      }
    } catch {
      setIsFollowing(!nextIsFollowing);
      setStats((prev) => ({
        ...prev,
        followers: prev.followers - followersDelta,
      }));
      setActionError(fallbackActionError);
    }
  };

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: updateProfileMe,
    onSuccess: (updatedProfile) => {
      const previousName = profile.name.trim().toLowerCase();
      const updatedName = updatedProfile.name.trim().toLowerCase();
      const hasRenamed = previousName !== updatedName;

      queryClient.setQueryData(profileMeQueryKey, updatedProfile);

      if (hasRenamed) {
        queryClient.removeQueries({
          queryKey: profileByNameQueryKey(previousName),
          exact: true,
        });
        queryClient.removeQueries({
          queryKey: profileByNameQueryKey(updatedName),
          exact: true,
        });
        queryClient.removeQueries({
          queryKey: ["profile", "check", previousName],
          exact: true,
        });
        queryClient.removeQueries({
          queryKey: ["profile", "check", updatedName],
          exact: true,
        });
      }

      setShowEditPopup(false);

      if (hasRenamed) {
        navigate("/profile", { replace: true });
      }
    },
    onError: (error) => {
      setActionError(
        error instanceof Error ? error.message : fallbackActionError,
      );
    },
  });

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-1 items-center space-x-4">
          <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} />
          <UserInfo name={profile.name} bio={bio} online={online} />
        </div>
        <UserActionButton
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEdit={() => setShowEditPopup(true)}
          onEditPreferences={() => setShowEditPreferencesPopup(true)}
          onToggleFollow={onToggleFollow}
        />
      </div>
      {actionError ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      ) : null}
      <UserStats
        followers={stats.followers}
        following={stats.following}
        onOpenFollowers={() => setOpenFollowList("followers")}
        onOpenFollowing={() => setOpenFollowList("following")}
      />

      {openFollowList ? (
        <FollowListModal
          userId={profile.id}
          type={openFollowList}
          onClose={() => setOpenFollowList(null)}
        />
      ) : null}

      {isOwnProfile && showEditPopup && "avatarUrl" in profile && (
        <EditProfilePopup
          currentUser={{
            name: profile.name,
            bio,
            avatarUrl: profile.avatarUrl,
          }}
          isSaving={isSaving}
          onSave={(updatedUser) => {
            setBio(updatedUser.bio);
            saveProfile({
              name: updatedUser.name,
              bio: updatedUser.bio,
            });
          }}
          onClose={() => setShowEditPopup(false)}
        />
      )}
      {isOwnProfile && showEditPreferencesPopup && (
        <EditPreferencesPopup
          onClose={() => setShowEditPreferencesPopup(false)}
        />
      )}
    </div>
  );
}
