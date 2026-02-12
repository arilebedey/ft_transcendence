import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

type Props = {
  label?: string;
  avatarUrl?: string;
};

export function UserSessionButton({
  label = "Ada Lovelace",
  avatarUrl,
}: Props) {
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  const userName = session?.user.name || label;
  const userAvatar = session?.user.image || avatarUrl;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="flex items-center gap-2 shrink-0"
      aria-label="Home"
    >
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">
            {userName.charAt(0)}
          </span>
        </div>
      )}
      <span className="font-bold text-lg hidden sm:block">{userName}</span>
    </a>
  );
}
