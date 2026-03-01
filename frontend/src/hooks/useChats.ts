import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import type { Chat } from "@/lib/chat.types";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Chat[]>("/chat")
      .then((data) => setChats(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load chats"),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleNewChat(chat: Chat) {
      setChats((prev) => {
        if (prev.some((c) => c.id === chat.id)) return prev;
        return [chat, ...prev];
      });
    }

    socket.on("newChat", handleNewChat);
    return () => {
      socket.off("newChat", handleNewChat);
    };
  }, []);

  useEffect(() => {
    function handleNewMessage(data: {
      conversationId: string;
      message: { content: string; createdAt: string; senderId: string };
    }) {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.id === data.conversationId);
        if (idx === -1) return prev;
        const updated: Chat = {
          ...prev[idx],
          updatedAt: data.message.createdAt,
          lastMessage: {
            content: data.message.content,
            createdAt: data.message.createdAt,
            senderId: data.message.senderId,
          },
        };
        const next = [...prev];
        next.splice(idx, 1);
        return [updated, ...next];
      });
    }

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // Updates the lastMessage for specific conversation and updates chats: Chat[] order
  const updateLastMessage = useCallback(
    // Typing `lastMessage` with TypeScript's indexed access type syntax ;)
    (conversationId: string, lastMessage: Chat["lastMessage"]) => {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.id === conversationId);
        if (idx === -1) return prev;
        const updated: Chat = {
          ...prev[idx],
          updatedAt: lastMessage?.createdAt ?? prev[idx].updatedAt,
          lastMessage,
        };
        const next = [...prev];
        next.splice(idx, 1);
        return [updated, ...next];
      });
    },
    [],
  );

  return { chats, setChats, loading, error, updateLastMessage };
}
