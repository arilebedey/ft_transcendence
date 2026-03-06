import { MessageCircle } from "lucide-react";

interface EmptyConversationProps {
  loading?: boolean;
}

export function EmptyConversation({
  loading = false,
}: EmptyConversationProps) {
  return (
    <div className="flex h-full min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <MessageCircle className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        {loading ? "Loading conversations..." : "Select a chat or start a new one"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {loading
          ? "Fetching your conversation list and preparing the current thread."
          : "Use the conversation list to load existing messages or create a new thread and send the first message."}
      </p>
    </div>
  );
}
