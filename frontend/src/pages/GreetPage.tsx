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

  {
    /*Main reworks -> Creer des components reutilisables pour harmoniser la DA*/
  }

  return (
    <div className="min-h-screen flex items-start pt-10 xl:pt-30">
      <div className="w-full max-w-8xl mx-auto px-6 md:px-12 lg:px-24 xl:px-60">
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-10">
          <div className="flex flex-col space-y-6 w-full lg:flex-1 xl:items-start items-center">
            <div>
              <div className="pb-2">
                <h1 className="text-4xl md:text-5xl xl:text-7xl text-center xl:text-start font-bold tracking-tight mb-4 md:mb-8">
                  SocialApp
                </h1>
              </div>
              {/*Reowrk en un component title.tsx qu'on pourra reutiliser partout*/}
              <p className="text-xl xl:text-2xl text-center xl:text-start  text-muted-foreground font-light">
                Connect, share, and discover with our community
              </p>
            </div>
            {/*Reowrk en un component content.tsx qu'on pourra reutiliser partout*/}
            <div className="space-y-3 text-lg text-muted-foreground">
              <p>✨ Share the content you watch</p>
              <p>🌐 Follow other's interests</p>
              <p>🧭 Discover!</p>
            </div>
          </div>

          <div className="flex justify-center xl:justify-end w-full lg:flex-1 md:mt-10 xl:mt-0">
            <div className="w-full max-w-md">
              <Auth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
