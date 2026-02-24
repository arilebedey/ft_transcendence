import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProfilePopup } from "@/components/profile/EditProfilePopup";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { UserInfo } from "@/components/profile/UserInfo";
import { UserStats } from "@/components/profile/UserStats";
import { UserActionButton } from "@/components/profile/UserActionButton";
import { EditPreferencesPopup } from "@/components/profile/EditPreferencesPopup";
import {
  profileMeQueryKey,
  type ProfileUserData,
  updateProfileMe,
} from "@/lib/profile-api";

interface UserCardProps {
  profile: ProfileUserData;
}

export function UserCard({ profile }: UserCardProps) {
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(profile.bio ?? "");

  useEffect(() => {
    setBio(profile.bio ?? "");
  }, [profile.bio]);

  const isOwnProfile = true;
  const isFollowing = false;
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditPreferencesPopup, setShowEditPreferencesPopup] =
    useState(false);

  const onToggleFollow = () => {
    // Implement follow/unfollow logic here
  };

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: updateProfileMe,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileMeQueryKey, updatedProfile);
      setShowEditPopup(false);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-between w-full gap-8">
        {/* Avatar + name + bio */}
        <div className="flex items-center space-x-4 flex-1">
          <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} />
          <UserInfo name={profile.name} bio={bio} />
        </div>
        {/* Edit profile button / follow/unfollow */}
        <UserActionButton
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEdit={() => setShowEditPopup(true)}
          onEditPreferences={() => setShowEditPreferencesPopup(true)}
          onToggleFollow={onToggleFollow}
        />
      </div>
      {/* Stats */}
      <UserStats followers={0} following={0} />

      {showEditPopup && (
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
      {showEditPreferencesPopup && (
        <EditPreferencesPopup
          onClose={() => setShowEditPreferencesPopup(false)}
        />
      )}
    </div>
  );
}
