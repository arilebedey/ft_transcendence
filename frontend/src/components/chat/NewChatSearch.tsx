import { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserSearch, type SearchUser } from "@/hooks/useUserSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PresenceDot } from "@/components/PresenceDot";
import { UserAvatar } from "@/components/profile/UserAvatar";

interface NewChatSearchProps {
  onSelectUser: (user: SearchUser) => void;
  onClose: () => void;
}

export function NewChatSearch({ onSelectUser, onClose }: NewChatSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const { results, loading, error } = useUserSearch(query);

  return (
    <div className="absolute inset-0 z-20 flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {t("chat.search.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("chat.search.subtitle")}
          </p>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b px-4 py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("chat.search.placeholder")}
            className="pl-9"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("chat.search.loading")}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!loading && !error && results.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("chat.search.empty")}
          </div>
        ) : null}

        {!loading ? (
          <div className="space-y-2">
            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onSelectUser(user)}
                className="flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors hover:bg-accent/40"
              >
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  className="h-10 w-10"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <PresenceDot online={user.online} className="shrink-0" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
