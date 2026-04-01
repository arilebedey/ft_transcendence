import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export function usePresenceStatus(userId?: string | null, initialOnline = false) {
  const [online, setOnline] = useState(initialOnline);

  useEffect(() => {
    setOnline(initialOnline);
  }, [initialOnline, userId]);

  useEffect(() => {
    if (!userId) return;

    function handlePresenceUpdate(data: { userId: string; online: boolean }) {
      if (data.userId === userId) {
        setOnline(data.online);
      }
    }

    socket.on("presence:update", handlePresenceUpdate);

    return () => {
      socket.off("presence:update", handlePresenceUpdate);
    };
  }, [userId]);

  return online;
}
