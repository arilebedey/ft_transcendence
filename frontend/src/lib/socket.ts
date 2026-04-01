import { io, Socket } from "socket.io-client";
import type { Chat, Message } from "@/lib/chat.types";

interface ServerToClientEvents {
  newMessage: (data: { conversationId: string; message: Message }) => void;
  newChat: (chat: Chat) => void;
  "presence:update": (data: { userId: string; online: boolean }) => void;
  unauthorized: (data: { reason: string }) => void;
}

interface ClientToServerEvents {
  joinRooms: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "",
  {
    autoConnect: false,
    withCredentials: true,
  },
);
