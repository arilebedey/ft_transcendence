import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Copy, KeyRound, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { ApiKeyListItem } from "@/lib/public-api";

const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "publicApi.keys.nameRequired"),
});

interface ApiKeysPanelProps {
  copiedText: string | null;
  createKeyMutationPending: boolean;
  deleteKeyMutationPending: boolean;
  error: string | null;
  isPending: boolean;
  keys: ApiKeyListItem[];
  latestCreatedKey: string | null;
  onCopy: (value: string) => Promise<void>;
  onCreate: (name: string) => Promise<void>;
  onDelete: (keyId: string) => void;
}

export function ApiKeysPanel({
  copiedText,
  createKeyMutationPending,
  deleteKeyMutationPending,
  error,
  isPending,
  keys,
  latestCreatedKey,
  onCopy,
  onCreate,
  onDelete,
}: ApiKeysPanelProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createApiKeySchema,
    },
    onSubmit: async ({ value }) => {
      await onCreate(value.name.trim());
      form.reset();
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-background p-4">
        <h3 className="text-lg font-semibold">
          {t("publicApi.documentation.title")}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("publicApi.documentation.overview")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("publicApi.documentation.auth")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("publicApi.documentation.security")}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <h3 className="text-lg font-semibold">{t("publicApi.content.keysTitle")}</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("publicApi.keys.createDescription")}
        </p>
        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => {
              const errors = field.state.meta.errors;
              const isInvalid = errors.length > 0;

              return (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder={t("publicApi.keys.namePlaceholder")}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? (
                      <p className="text-sm text-destructive">
                        {typeof errors[0] === "string"
                          ? t(errors[0])
                          : errors[0]?.message
                            ? t(errors[0].message)
                            : ""}
                      </p>
                    ) : null}
                  </div>
                  <Button type="submit" disabled={createKeyMutationPending}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    {createKeyMutationPending
                      ? t("publicApi.keys.creating")
                      : t("publicApi.keys.generate")}
                  </Button>
                </div>
              );
            }}
          />
        </form>

        {latestCreatedKey ? (
          <div className="mt-4 rounded-xl border border-border bg-muted p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">
                {t("publicApi.keys.copyNewKey")}
              </p>
              <Button
                variant="outline"
                onClick={() => void onCopy(latestCreatedKey)}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copiedText === latestCreatedKey
                  ? t("publicApi.actions.copied")
                  : t("publicApi.actions.copy")}
              </Button>
            </div>
            <pre className="mt-3 overflow-x-auto text-xs">
              {latestCreatedKey}
            </pre>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-sm font-medium">{t("publicApi.keys.yourKeys")}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("publicApi.keys.yourKeysDescription")}
        </p>

        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}

        {isPending ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("publicApi.keys.loading")}
          </p>
        ) : keys.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("publicApi.keys.empty")}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="rounded-xl border border-border bg-muted/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {key.name || t("publicApi.keys.unnamed")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("publicApi.keys.created")}{" "}
                      {new Date(key.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    disabled={deleteKeyMutationPending}
                    onClick={() => onDelete(key.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("publicApi.actions.remove")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
