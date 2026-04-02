import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";
import { UserAvatar } from "@/components/profile/UserAvatar";

type Props = {
  label?: string;
  showNameOnMobile?: boolean;
};

export function UserSessionButton({
  label = "",
  showNameOnMobile = false,
}: Props) {
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
      className="flex min-w-0 items-center gap-2 shrink"
    >
      <UserAvatar name={userName} avatarUrl={userAvatar} className="w-8 h-8" />
      <span
        className={[
          "min-w-0 truncate font-bold text-lg",
          showNameOnMobile ? "block max-w-[40vw] sm:max-w-none" : "hidden sm:block",
        ].join(" ")}
      >
        {userName}
      </span>
    </a>
  );
}
