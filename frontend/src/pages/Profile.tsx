import { UserCard } from "@/components/profile/UserCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getProfileMe,
  getProfileByName,
  checkUsernameAvailable,
  profileMeQueryKey,
  profileByNameQueryKey,
} from "@/lib/profile-api";

export function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { t } = useTranslation();

  // Check username existence immediately (parallel with own profile fetch)
  // available: true  → username is free → profile does NOT exist
  // available: false → username is taken → profile exists
  const {
    data: usernameCheck,
    isPending: checkPending,
  } = useQuery({
    queryKey: ["profile", "check", username ?? ""],
    queryFn: () => checkUsernameAvailable(username!),
    enabled: !!username,
    staleTime: 30_000,
  });

  const userNotFound = !!username && !checkPending && usernameCheck?.available === true;

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

  // Fetch other user's profile only once we know the username exists
  const isOtherUser = !!username && username !== ownProfile?.name;
  const shouldFetchOtherProfile = isOtherUser && usernameCheck?.available === false;
  const {
    data: otherProfile,
    isPending: otherPending,
    isError: otherError,
    error: otherErrorObj,
  } = useQuery({
    queryKey: profileByNameQueryKey(username ?? ""),
    queryFn: () => getProfileByName(username!),
    enabled: shouldFetchOtherProfile,
  });

  // Show not found immediately as soon as the check returns
  if (userNotFound) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
          <div className="w-full px-10 py-8 text-destructive">
            {t("profileNotFound")}
          </div>
        </div>
      </div>
    );
  }

  const isPending = ownPending || (!!username && checkPending) || (isOtherUser && otherPending);
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
