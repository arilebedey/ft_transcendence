import React from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Auth } from "./Auth";
import { AppName } from "@/components/ui/appName";

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

  {/*Main reworks -> Creer des components reutilisables pour harmoniser la DA*/ }

  return (
    <div className="min-h-screen flex items-start pt-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-start space-y-6 mt-8 md:mt-16">
          <div>
            <AppName />
            {/*Reowrk en un component title.tsx qu'on pourra reutiliser partout*/}
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Connect, share, and discover with our community
            </p>
          </div>
          {/*Reowrk en un component content.tsx qu'on pourra reutiliser partout*/}
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
