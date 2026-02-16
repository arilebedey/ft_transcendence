import { authClient } from "@/lib/auth-client";
import { UserCard } from "@/components/profile/UserCard";
import { Button } from "@/components/ui/button";

export function Profile() {
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          if (ctx.error.status === 400) {
            console.error("Cannot sign out fake session. -Ari");
          }
        },
      },
    });
  };

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full max-w-5xl rounded-lg bg-card shadow-sm">
        {/* User card with buttons */}
        <div className="w-full px-10 py-8">
          <UserCard />
        </div>
      </div>
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
    </div>
  );
}
