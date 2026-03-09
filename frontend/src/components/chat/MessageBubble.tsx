import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LocalMessage } from "@/lib/chat.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: LocalMessage;
  isOwnMessage: boolean;
  onRetry?: () => void;
  onDiscard?: () => void;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  isOwnMessage,
  onRetry,
  onDiscard,
}: MessageBubbleProps) {
  const { t } = useTranslation();
  const isFailed = message._status === "failed";
  const isSending = message._status === "sending";

  return (
    <div
      className={cn(
        "flex min-w-0 w-full overflow-x-hidden",
        isOwnMessage ? "justify-end" : "justify-start",
      )}
    >
      <div className="min-w-0 max-w-[85%] overflow-x-hidden space-y-1">
        <div
          className={cn(
            "min-w-0 overflow-x-hidden rounded-2xl px-4 py-3 text-sm shadow-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
            isFailed && "border border-destructive/30 bg-destructive/10 text-foreground",
          )}
        >
          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {message.content}
          </p>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground",
            isOwnMessage ? "justify-end" : "justify-start",
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isSending ? <span>{t("chat.message.sending")}</span> : null}
          {isFailed ? (
            <>
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">
                {t("chat.message.failed")}
              </span>
            </>
          ) : null}
        </div>

        {isFailed && (onRetry || onDiscard) ? (
          <div
            className={cn(
              "flex min-w-0 flex-wrap gap-2",
              isOwnMessage ? "justify-end" : "justify-start",
            )}
          >
            {onRetry ? (
              <Button type="button" size="sm" variant="outline" onClick={onRetry}>
                {t("chat.message.retry")}
              </Button>
            ) : null}
            {onDiscard ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onDiscard}
              >
                {t("chat.message.dismiss")}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
