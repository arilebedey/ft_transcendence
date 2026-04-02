import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";
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
      <Card className="rounded-2xl shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {t("publicApi.documentation.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription>
            {t("publicApi.documentation.overview")}
          </CardDescription>
          <CardDescription>{t("publicApi.documentation.auth")}</CardDescription>
          <CardDescription>
            {t("publicApi.documentation.security")}
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {t("publicApi.content.keysTitle")}
          </CardTitle>
          <CardDescription>
            {t("publicApi.keys.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
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
            <Card className="rounded-xl border-dashed bg-muted/40 shadow-none">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("publicApi.keys.copyNewKey")}
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => void onCopy(latestCreatedKey)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copiedText === latestCreatedKey
                    ? t("publicApi.actions.copied")
                    : t("publicApi.actions.copy")}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto text-xs">
                  {latestCreatedKey}
                </pre>
              </CardContent>
            </Card>
          ) : null}
        </CardContent>
      </Card>

      <ListCard title={t("publicApi.keys.yourKeys")} className="rounded-2xl">
        <p className="text-sm text-muted-foreground">
          {t("publicApi.keys.yourKeysDescription")}
        </p>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {isPending ? (
          <p className="text-sm text-muted-foreground">
            {t("publicApi.keys.loading")}
          </p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("publicApi.keys.empty")}
          </p>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <ListItem
                key={key.id}
                primary={key.name || t("publicApi.keys.unnamed")}
                secondary={`${t("publicApi.keys.created")} ${new Date(
                  key.createdAt,
                ).toLocaleString()}`}
                action={
                  <Button
                    variant="outline"
                    disabled={deleteKeyMutationPending}
                    onClick={() => onDelete(key.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("publicApi.actions.remove")}
                  </Button>
                }
                className="rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
        )}
      </ListCard>
    </div>
  );
}
