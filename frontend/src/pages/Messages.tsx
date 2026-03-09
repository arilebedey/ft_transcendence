import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatList } from "@/components/chat/ChatList";
import { ConversationPanel } from "@/components/chat/ConversationPanel";
import { EmptyConversation } from "@/components/chat/EmptyConversation";
import { NewChatSearch } from "@/components/chat/NewChatSearch";
import { authClient } from "@/lib/auth-client";
import { useChats } from "@/hooks/useChats";
import { useSocket } from "@/hooks/useSocket";
import type { Chat, Participant } from "@/lib/chat.types";
import type { SearchUser } from "@/hooks/useUserSearch";

export function Messages() {
  useSocket();

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? "";

  const { chats, setChats, loading, error, updateLastMessage } = useChats();

  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [draftParticipant, setDraftParticipant] = useState<Participant | null>(
    null,
  );
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");
  const [loadingDelayElapsed, setLoadingDelayElapsed] = useState(!loading);

  const activeConversationId =
    draftParticipant === null
      ? (selectedConversationId ?? chats[0]?.id ?? null)
      : null;
  const selectedChat =
    chats.find((chat) => chat.id === activeConversationId) ?? null;

  useEffect(() => {
    const timeoutMs = loading ? 0 : 200;
    const timeoutId = window.setTimeout(() => {
      setLoadingDelayElapsed(!loading);
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [loading]);

  const handleSelectConversation = (conversationId: string) => {
    setDraftParticipant(null);
    setSelectedConversationId(conversationId);
    setShowNewChat(false);
    setMobileView("conversation");
  };

  const handleSelectUser = (user: SearchUser) => {
    const existingChat = chats.find((chat) => chat.participant?.id === user.id);

    if (existingChat) {
      handleSelectConversation(existingChat.id);
      return;
    }

    setDraftParticipant(user);
    setSelectedConversationId(null);
    setShowNewChat(false);
    setMobileView("conversation");
  };

  const handleConversationCreated = (chat: Chat) => {
    setChats((prev) => {
      const existing = prev.find((item) => item.id === chat.id);
      if (existing) {
        return [chat, ...prev.filter((item) => item.id !== chat.id)];
      }
      return [chat, ...prev];
    });
    setDraftParticipant(null);
    setSelectedConversationId(chat.id);
    setMobileView("conversation");
  };

  const showConversation = selectedChat || draftParticipant;
  const showConversationPlaceholder =
    (loading || !loadingDelayElapsed) && !showConversation;

  return (
    <Layout
      showSearchBar={false}
      showLanguageToggle={false}
      showThemeToggle={false}
    >
      <div className="fixed inset-x-0 top-16 bottom-16 overflow-hidden">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-0 overflow-hidden px-0 py-0 md:gap-4 md:px-4 md:py-4 md:flex-row">
          <div
            className={[
              "relative h-full min-h-0 min-w-0 flex-1 overflow-hidden md:w-[22rem] md:min-w-[22rem] md:flex-none",
              mobileView === "conversation" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <ChatList
              chats={chats}
              loading={loading}
              error={error}
              selectedConversationId={activeConversationId}
              onStartNewChat={() => setShowNewChat(true)}
              onSelectConversation={handleSelectConversation}
            />

            {showNewChat ? (
              <NewChatSearch
                onSelectUser={handleSelectUser}
                onClose={() => setShowNewChat(false)}
              />
            ) : null}
          </div>

          <div
            className={[
              "h-full min-h-0 min-w-0 flex-1 overflow-hidden",
              mobileView === "list" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            {showConversation ? (
              <ConversationPanel
                conversationId={selectedChat?.id ?? null}
                userId={userId}
                participant={selectedChat?.participant ?? null}
                draftParticipant={draftParticipant}
                onConversationCreated={handleConversationCreated}
                onMessageSent={updateLastMessage}
                onBack={() => setMobileView("list")}
              />
            ) : showConversationPlaceholder ? (
              <EmptyConversation loading />
            ) : (
              <EmptyConversation />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
