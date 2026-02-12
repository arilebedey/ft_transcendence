import React from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Auth } from "./Auth";

export function GreetPage() {
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  React.useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 lg:px-20">
        <div className="flex flex-col justify-center items-start space-y-6">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
              SocialApp
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Connect, share, and discover with our community
            </p>
          </div>
          <div className="space-y-3 text-lg text-muted-foreground">
            <p>✨ Share your thoughts</p>
            <p>🌐 Expand your network</p>
            <p>💬 Engage with others</p>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-start">
          <div className="w-full max-w-md">
            <Auth />
          </div>
        </div>
      </div>
    </div>
  );
}
