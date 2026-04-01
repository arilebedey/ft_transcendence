import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { UserPreferencesSync } from "@/components/UserPreferencesSync";
import { useSocket } from "@/hooks/useSocket";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  useSocket();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/", { replace: true });
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {children}
      <UserPreferencesSync />
    </>
  );
}
