import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";

type Props = {
  label?: string;
};

export function UserSessionButton({ label = "Ada Lovelace" }: Props) {
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
  });

  const userName = profile?.name || label;
  const userAvatar = profile?.avatarUrl || undefined;

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
          src={"/storage/" + userAvatar}
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
