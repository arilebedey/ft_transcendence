import React from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev && !session) {
    navigate("/auth");
    return null;
  }

  return <>{children}</>;
}
