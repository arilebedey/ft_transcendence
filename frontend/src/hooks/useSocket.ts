import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { authClient } from "@/lib/auth-client";

export function useSocket() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      if (socket.connected) socket.disconnect();
      return;
    }

    function onConnect() {
      socket.emit("joinRooms");
    }

    // Registers a listener that fires when our client connects to the server
    socket.on("connect", onConnect);

    if (!socket.connected) socket.connect();

    return () => {
      // Removes above listener
      socket.off("connect", onConnect);
    };
  }, [userId]);

  return socket;
}
