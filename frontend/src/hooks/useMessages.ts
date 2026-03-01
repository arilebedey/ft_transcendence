import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import type {
  Chat,
  Message,
  LocalMessage,
  MessagesResponse,
} from "@/lib/chat.types";

interface UseMessagesParams {
  conversationId: string | null;
  userId: string;
  draftParticipantId?: string | null;
  onConversationCreated?: (chat: Chat) => void;
  onMessageSent?: (
    conversationId: string,
    lastMessage: Chat["lastMessage"],
  ) => void;
}

function mergeIncomingMessage(
  prev: LocalMessage[],
  message: Message,
  currentUserId: string,
) {
  if (prev.some((existing) => existing.id === message.id)) return prev;

  if (message.senderId === currentUserId) {
    const optimisticIndex = prev.findIndex(
      (existing) =>
        existing._tempId &&
        existing._status === "sending" &&
        existing.senderId === currentUserId &&
        existing.content === message.content,
    );

    if (optimisticIndex !== -1) {
      const next = [...prev];
      next[optimisticIndex] = { ...message, _status: "sent" };
      return next;
    }
  }

  return [...prev, message];
}

export function useMessages({
  conversationId,
  userId,
  draftParticipantId,
  onConversationCreated,
  onMessageSent,
}: UseMessagesParams) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Why use refs here?
  // useRef doesn't trigger re-renders when you update it
  // Values only needed for logic, not to display anything
  const cursorRef = useRef<number | null>(null);
  const conversationIdRef = useRef(conversationId);
  const userIdRef = useRef(userId);
  const draftParticipantIdRef = useRef(draftParticipantId);
  const onConversationCreatedRef = useRef(onConversationCreated);
  const onMessageSentRef = useRef(onMessageSent);
  const loadingMoreRef = useRef(false);
  const pendingContentRef = useRef(new Map<string, string>());

  conversationIdRef.current = conversationId;
  userIdRef.current = userId;
  draftParticipantIdRef.current = draftParticipantId;
  onConversationCreatedRef.current = onConversationCreated;
  onMessageSentRef.current = onMessageSent;

  // Fetch existing conversation messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setHasMore(false);
      cursorRef.current = null;
      setSendError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setMessages([]);
    setSendError(null);
    cursorRef.current = null;

    api
      .get<MessagesResponse>(`/chat/${conversationId}`)
      .then((data) => {
        if (cancelled) return;
        setMessages(data.messages);
        cursorRef.current = data.nextCursor;
        setHasMore(data.nextCursor !== null);
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Handle message arriving through socket
  useEffect(() => {
    function handleNewMessage(data: {
      conversationId: string;
      message: Message;
    }) {
      if (data.conversationId !== conversationIdRef.current) return;

      setMessages((prev) =>
        mergeIncomingMessage(prev, data.message, userIdRef.current),
      );
    }

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // Creates an optimistic message, then reconciles it with either
  // the socket echo or the POST response, whichever arrives first.
  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setSendError(null);

    const tempId = `tmp_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const optimistic: LocalMessage = {
      id: tempId,
      conversationId: conversationIdRef.current ?? "",
      senderId: userIdRef.current,
      content: trimmed,
      seq: -1,
      createdAt: now,
      _status: "sending",
      _tempId: tempId,
    };

    // Stores content to allow retrying failed message
    pendingContentRef.current.set(tempId, trimmed);

    // Case when the conversation doesn't exist yet
    if (draftParticipantIdRef.current && !conversationIdRef.current) {
      setMessages([optimistic]);
      try {
        const chat = await api.post<Chat>("/chat", {
          participantId: draftParticipantIdRef.current,
        });
        conversationIdRef.current = chat.id;
        draftParticipantIdRef.current = null;

        const message = await api.post<Message>(`/chat/${chat.id}/messages`, {
          content: trimmed,
        });

        pendingContentRef.current.delete(tempId);
        setMessages((prev) =>
          mergeIncomingMessage(prev, message, userIdRef.current),
        );
        setSendError(null);
        setHasMore(false);
        cursorRef.current = null;
        onConversationCreatedRef.current?.(chat);
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId ? { ...m, _status: "failed" } : m,
          ),
        );
        setSendError(err instanceof Error ? err.message : "Failed to send");
      }
      return;
    }

    if (conversationIdRef.current) {
      setMessages((prev) => [...prev, optimistic]);

      try {
        const message = await api.post<Message>(
          `/chat/${conversationIdRef.current}/messages`,
          { content: trimmed },
        );

        pendingContentRef.current.delete(tempId);

        // Calls updateLastMessage() from useChats hook
        // which expects conversationId, lastMessage
        onMessageSentRef.current?.(conversationIdRef.current, {
          content: trimmed,
          createdAt: now,
          senderId: userIdRef.current,
        });

        setMessages((prev) =>
          mergeIncomingMessage(
            prev.map((m) =>
              m._tempId === tempId ? { ...message, _status: "sent" } : m,
            ),
            message,
            userIdRef.current,
          ),
        );
        setSendError(null);
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId ? { ...m, _status: "failed" } : m,
          ),
        );
        setSendError(err instanceof Error ? err.message : "Failed to send");
      }
    }
  }, []);

  const fetchMore = useCallback(async () => {
    const cid = conversationIdRef.current;
    if (!cid || cursorRef.current === null || loadingMoreRef.current) return;

    loadingMoreRef.current = true; // needed to guard synchronously
    setLoadingMore(true); // needed to update UI
    try {
      const data = await api.get<MessagesResponse>(
        `/chat/${cid}?cursor=${cursorRef.current}`,
      );
      setMessages((prev) => [...data.messages, ...prev]);
      cursorRef.current = data.nextCursor;
      setHasMore(data.nextCursor !== null);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  const retryMessage = useCallback(async (tempId: string) => {
    const content = pendingContentRef.current.get(tempId);
    if (!content) return;

    setSendError(null);
    setMessages((prev) =>
      prev.map(
        (m) => (m._tempId === tempId ? { ...m, _status: "sending" } : m), // mutating object by spreading to trigger re-render
      ),
    );

    try {
      const message = await api.post<Message>(
        `/chat/${conversationIdRef.current}/messages`,
        { content },
      );

      pendingContentRef.current.delete(tempId);

      setMessages((prev) =>
        mergeIncomingMessage(
          prev.map((m) =>
            m._tempId === tempId ? { ...message, _status: "sent" } : m,
          ),
          message,
          userIdRef.current,
        ),
      );
      setSendError(null);
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m._tempId === tempId ? { ...m, _status: "failed" } : m,
        ),
      );
      setSendError(err instanceof Error ? err.message : "Failed to send");
    }
  }, []);

  const discardMessage = useCallback((tempId: string) => {
    pendingContentRef.current.delete(tempId);
    setMessages((prev) => prev.filter((m) => m._tempId !== tempId));
    setSendError(null);
  }, []);

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    fetchMore,
    sendMessage,
    retryMessage,
    discardMessage,
    sendError,
  };
}
