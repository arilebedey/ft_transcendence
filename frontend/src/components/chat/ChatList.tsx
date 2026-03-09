import { MessageCirclePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Chat } from "@/lib/chat.types";
import { Button } from "@/components/ui/button";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  selectedConversationId: string | null;
  onStartNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatList({
  chats,
  loading,
  error,
  selectedConversationId,
  onStartNewChat,
  onSelectConversation,
}: ChatListProps) {
  const { t } = useTranslation();

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border bg-card md:rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {t("chat.list.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("chat.list.conversationCount", { count: chats.length })}
          </p>
        </div>

        <Button type="button" size="sm" onClick={onStartNewChat}>
          <MessageCirclePlus className="mr-2 h-4 w-4" />
          {t("chat.list.newChat")}
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {loading ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("chat.list.loading")}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!loading && !error && chats.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("chat.list.empty")}
          </div>
        ) : null}

        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            selected={chat.id === selectedConversationId}
            onClick={() => onSelectConversation(chat.id)}
          />
        ))}
      </div>
    </aside>
  );
}
