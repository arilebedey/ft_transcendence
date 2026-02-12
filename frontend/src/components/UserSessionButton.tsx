import React from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  label?: string;
  avatarUrl?: string;
};

//Include fetch from db to get user avatar and name for the header brand component
export function UserSessionButton({ label = "T", avatarUrl }: Props) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await fetch("/api/users/session", {
          credentials: "include",
        });
        if (res.ok) {
          navigate("/profile");
        } else {
          navigate("/auth");
        }
      } catch (err) {
        navigate("/auth");
      }
    })();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="flex items-center gap-2 shrink-0"
      aria-label="Home"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={label}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">
            {label.charAt(0)}
          </span>
        </div>
      )}
      <span className="font-bold text-lg hidden sm:block">{label}</span>
    </a>
  );
}
