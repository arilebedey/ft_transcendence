import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Chat } from "@/lib/chat.types";

interface ChatListItemProps {
  chat: Chat;
  selected?: boolean;
  onClick: () => void;
}

function formatTimestamp(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();

  return isSameDay
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ChatListItem({
  chat,
  selected = false,
  onClick,
}: ChatListItemProps) {
  const { t } = useTranslation();
  const timestamp = formatTimestamp(
    chat.lastMessage?.createdAt ?? chat.updatedAt ?? null,
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
        selected
          ? "border-primary/30 bg-primary/10"
          : "border-transparent bg-card hover:border-border hover:bg-accent/40",
      )}
    >
      <Avatar className="h-11 w-11">
        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
          {getInitials(chat.participant?.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {chat.participant?.name ?? t("chat.list.unknownUser")}
          </p>
          {timestamp ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {timestamp}
            </span>
          ) : null}
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {chat.lastMessage?.content ?? t("chat.list.noMessagesYet")}
        </p>
      </div>
    </button>
  );
}
