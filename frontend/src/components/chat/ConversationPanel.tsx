import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { Chat, Participant } from "@/lib/chat.types";

interface ConversationPanelProps {
  conversationId: string | null;
  userId: string;
  participant: Participant | null;
  draftParticipant?: Participant | null;
  onConversationCreated?: (chat: Chat) => void;
  onMessageSent?: (
    conversationId: string,
    lastMessage: Chat["lastMessage"],
  ) => void;
  onBack?: () => void; // for mobile viewers, set view to ChatList
}

export function ConversationPanel({
  conversationId,
  userId,
  participant,
  draftParticipant = null,
  onConversationCreated,
  onMessageSent,
  onBack,
}: ConversationPanelProps) {
  const { t } = useTranslation();
  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    fetchMore,
    sendMessage,
    retryMessage,
    discardMessage,
    sendError,
  } = useMessages({
    conversationId,
    userId,
    draftParticipantId: draftParticipant?.id ?? null,
    onConversationCreated,
    onMessageSent,
  });

  // Used to control scroll by pointing to specific message div
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const previousLastMessageKeyRef = useRef<string | null>(null);
  // Stores previous `loading` state,
  // useful to know when loading first changed from true to false
  const previousLoadingRef = useRef(loading);

  const [content, setContent] = useState("");

  const activeParticipant = participant ?? draftParticipant ?? null;

  const scrollToBottom = (behavior: ScrollBehavior) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  // Calculate scroll position logic before the browser renders
  // useLayoutEffect runs synchronously after DOM mutations but before the browser paints
  useLayoutEffect(() => {
    // Get key of the last message
    const lastMessage = messages[messages.length - 1];
    const lastMessageKey = lastMessage
      ? (lastMessage._tempId ?? lastMessage.id)
      : null;

    // Compare: did last message change?
    const lastMessageChanged =
      previousLastMessageKeyRef.current !== lastMessageKey;

    // The first render after loading completes
    const loadingFinished = previousLoadingRef.current && !loading;

    const shouldScrollToBottom =
      messages.length > 0 && (lastMessageChanged || loadingFinished);

    previousLastMessageKeyRef.current = lastMessageKey;
    previousLoadingRef.current = loading;

    if (!shouldScrollToBottom) return;

    scrollToBottom(loadingFinished ? "auto" : "smooth");
  }, [loading, messages]);

  // fresh ConversationPanel renders, set previousLoadingRef to true
  useEffect(() => {
    previousLastMessageKeyRef.current = null;
    previousLoadingRef.current = true;
  }, [conversationId]);

  const handleLoadMore = async () => {
    const container = messagesContainerRef.current;
    // mount problems, still fetch
    if (!container) {
      await fetchMore();
      return;
    }

    // total scrollable content height before fetch
    const previousScrollHeight = container.scrollHeight;
    // User's current scroll distance to top before fetch
    const previousScrollTop = container.scrollTop;

    await fetchMore();

    // requestAnimationFrame schedules a callback
    // to run before the next browser repaint
    requestAnimationFrame(() => {
      const nextContainer = messagesContainerRef.current;
      if (!nextContainer) return;

      // scroll the element
      nextContainer.scrollTop =
        previousScrollTop + (nextContainer.scrollHeight - previousScrollHeight);
    });
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setContent("");
    await sendMessage(trimmed);
  };

  return (
    <section className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden bg-card md:rounded-2xl md:border">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-4">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : null}

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {activeParticipant?.name ?? t("chat.conversation.titleFallback")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {conversationId
              ? t("chat.conversation.live")
              : t("chat.conversation.new")}
          </p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto flex min-w-0 w-full max-w-3xl flex-col gap-4">
          {hasMore ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleLoadMore()}
                disabled={loadingMore}
              >
                {loadingMore
                  ? t("chat.conversation.loadingMore")
                  : t("chat.conversation.loadOlder")}
              </Button>
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              {t("chat.conversation.loadingMessages")}
            </div>
          ) : null}

          {!loading && messages.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              {t("chat.conversation.empty")}
            </div>
          ) : null}

          {messages.map((message) => (
            <MessageBubble
              key={message._tempId ?? message.id}
              message={message}
              isOwnMessage={message.senderId === userId}
              onRetry={
                message._tempId
                  ? () => void retryMessage(message._tempId!)
                  : undefined
              }
              onDiscard={
                message._tempId
                  ? () => discardMessage(message._tempId!)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t bg-card/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        {sendError ? (
          <div className="mb-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {sendError}
          </div>
        ) : null}

        <div className="mx-auto flex min-w-0 w-full max-w-3xl items-end gap-2 overflow-x-hidden">
          <textarea
            rows={1}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder={t("chat.conversation.inputPlaceholder")}
            className="max-h-40 min-h-12 min-w-0 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 lg:resize-y"
          />
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!content.trim()}
            className="min-h-12 min-w-12 shrink-0 self-stretch px-0 rounded-xl"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
