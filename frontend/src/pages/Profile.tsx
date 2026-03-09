import { UserCard } from "@/components/profile/UserCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getProfileMe,
  getProfileByName,
  profileMeQueryKey,
  profileByNameQueryKey,
} from "@/lib/profile-api";

export function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { t } = useTranslation();

  // Always fetch own profile to determine ownership
  const {
    data: ownProfile,
    isPending: ownPending,
    isError: ownError,
    error: ownErrorObj,
  } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
  });

  // Fetch other user's profile when a username param is present
  const isOtherUser = !!username && username !== ownProfile?.name;
  const {
    data: otherProfile,
    isPending: otherPending,
    isError: otherError,
    error: otherErrorObj,
  } = useQuery({
    queryKey: profileByNameQueryKey(username ?? ""),
    queryFn: () => getProfileByName(username!),
    enabled: isOtherUser,
  });

  const isPending = ownPending || (isOtherUser && otherPending);
  const isError = ownError || (isOtherUser && otherError);
  const error = isOtherUser ? otherErrorObj : ownErrorObj;
  const isOwnProfile = !username || username === ownProfile?.name;
  const displayProfile = isOwnProfile ? ownProfile : otherProfile;

  if (isPending) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
          <div className="w-full px-10 py-8 text-muted-foreground">
            {t("loadingProfile")}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !displayProfile) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
          <div className="w-full px-10 py-8 text-destructive">
            {error instanceof Error ? error.message : t("unableToLoadProfile")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
        <div className="w-full px-10 py-8">
          <UserCard profile={displayProfile} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
}
