import { UserCard } from "@/components/profile/UserCard";
import { useQuery } from "@tanstack/react-query";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";

export function Profile() {
  const {
    data: profile,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
  });

  if (isPending) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
          <div className="w-full px-10 py-8 text-muted-foreground">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
          <div className="w-full px-10 py-8 text-destructive">
            {error instanceof Error ? error.message : "Unable to load profile"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
        {/* User card with buttons */}
        <div className="w-full px-10 py-8">
          <UserCard profile={profile} />
        </div>
      </div>
    </div>
  );
}
