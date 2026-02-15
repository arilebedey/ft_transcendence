import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const isDev = import.meta.env.VITE_IS_DEV;

  useEffect(() => {
    if (!isPending && !session && !isDev) {
      navigate("/", { replace: true });
    }
  }, [session, isPending, isDev, navigate]);

  if (isPending && !isDev) {
    return <div>Loading...</div>;
  }

  if (!isDev && !session) {
    return null;
  }

  return <>{children}</>;
}
