import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";
import { UserAvatar } from "@/components/profile/UserAvatar";

type Props = {
  label?: string;
};

export function UserSessionButton({ label = "" }: Props) {
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
    >
      <UserAvatar name={userName} avatarUrl={userAvatar} className="w-8 h-8" />
      <span className="font-bold text-lg hidden sm:block">{userName}</span>
    </a>
  );
}
