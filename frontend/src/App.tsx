import { useEffect, useState } from "react";
import { authClient } from "./lib/auth-client";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Loading from "./components/Loading";

function App() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<"login" | "signup">("signup");
  const [delayLoading, setDelayLoading] = useState(true);

  // Test VERSION
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (isLoading) {
        setDelayLoading(true);
      } else {
        await sleep(2000); // 2s
        if (mounted) setDelayLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoading]);

  // Test VERSION
  if (delayLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading label="Loading" size="md" />
      </div>
    );
  }



  if (session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-300">
            You are signed in as {session.user.email}
          </p>
          <button
            onClick={() => authClient.signOut()}
            className="mt-2 bg-red-900 px-4 py-2 rounded-md hover:bg-violet-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <AuthSection />
    </div>
  );
}

export default App;
