import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useAuthUiStore } from "@/stores/auth-ui-store";

export function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const beginLogout = useAuthUiStore((state) => state.beginLogout);

  useEffect(() => {
    let active = true;
    beginLogout();

    void (async () => {
      await queryClient.cancelQueries();
      queryClient.clear();

      try {
        await authClient.signOut();
      } finally {
        if (active) {
          navigate("/", { replace: true });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [beginLogout, navigate, queryClient]);

  return null;
}
