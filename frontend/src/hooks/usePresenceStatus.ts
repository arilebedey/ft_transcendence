import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export function usePresenceStatus(
  userId?: string | null,
  initialOnline = false,
) {
  const [livePresence, setLivePresence] = useState<{
    userId: string;
    online: boolean;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;

    function handlePresenceUpdate(data: { userId: string; online: boolean }) {
      if (data.userId === userId) {
        setLivePresence(data);
      }
    }

    socket.on("presence:update", handlePresenceUpdate);
    return () => {
      socket.off("presence:update", handlePresenceUpdate);
    };
  }, [userId]);

  return livePresence?.userId === userId ? livePresence!.online : initialOnline;
}
