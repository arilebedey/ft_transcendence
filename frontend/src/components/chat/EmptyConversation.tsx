import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyConversationProps {
  loading?: boolean;
}

export function EmptyConversation({
  loading = false,
}: EmptyConversationProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <MessageCircle className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        {loading
          ? t("chat.empty.loadingTitle")
          : t("chat.empty.idleTitle")}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {loading
          ? t("chat.empty.loadingDescription")
          : t("chat.empty.idleDescription")}
      </p>
    </div>
  );
}
