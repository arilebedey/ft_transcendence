import { authClient } from "@/lib/auth-client";
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
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {session?.user.name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-2">{session?.user.email}</p>
        </div>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  );
}
