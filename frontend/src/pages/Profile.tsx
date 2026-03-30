import { UserCard } from "@/components/profile/UserCard";
import { UserPosts } from "@/components/profile/UserPosts";
import { Layout } from "@/components/Layout";
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
  const { data: usernameCheck, isPending: checkPending } = useQuery({
    queryKey: ["profile", "check", username ?? ""],
    queryFn: () => checkUsernameAvailable(username!),
    enabled: !!username,
    staleTime: 30_000,
  });

  const userNotFound =
    !!username && !checkPending && usernameCheck?.available === true;

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
  const shouldFetchOtherProfile =
    isOtherUser && usernameCheck?.available === false;
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

  const renderStateCard = (
    content: string,
    tone: "default" | "error" = "default",
  ) => (
    <Layout
      showSearchBar={false}
      showLanguageToggle={false}
      showThemeToggle={false}
    >
      <div className="flex justify-center px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full max-w-5xl rounded-2xl bg-card shadow-sm sm:rounded-3xl">
          <div
            className={`w-full px-4 py-6 sm:px-8 sm:py-8 md:px-10 ${
              tone === "error" ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {content}
          </div>
        </div>
      </div>
    </Layout>
  );

  // Show not found immediately as soon as the check returns
  if (userNotFound) {
    return renderStateCard(t("profileNotFound"), "error");
  }

  const isPending =
    ownPending || (!!username && checkPending) || (isOtherUser && otherPending);
  const isError = ownError || (isOtherUser && otherError);
  const error = isOtherUser ? otherErrorObj : ownErrorObj;
  const isOwnProfile = !username || username === ownProfile?.name;
  const displayProfile = isOwnProfile ? ownProfile : otherProfile;

  if (isPending) {
    return renderStateCard(t("loadingProfile"));
  }

  if (isError || !displayProfile) {
    return renderStateCard(
      error instanceof Error ? error.message : t("unableToLoadProfile"),
      "error",
    );
  }

  return (
    <Layout
      showSearchBar={false}
      showLanguageToggle={false}
      showThemeToggle={false}
    >
      <div className="flex justify-center px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full max-w-5xl rounded-2xl bg-card shadow-sm sm:rounded-3xl">
          <div className="w-full px-4 py-6 sm:px-8 sm:py-8 md:px-10">
            <UserCard profile={displayProfile} isOwnProfile={isOwnProfile} />
            <UserPosts profileId={displayProfile.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
