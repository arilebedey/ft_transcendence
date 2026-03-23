import { Button } from "@/components/ui/button";
import { buildCurlExample, publicApiEndpoints } from "@/lib/public-api";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EndpointPanelProps {
  endpoint: (typeof publicApiEndpoints)[number];
  copiedText: string | null;
  onCopy: (value: string) => Promise<void>;
}

export function EndpointPanel({
  endpoint,
  copiedText,
  onCopy,
}: EndpointPanelProps) {
  const { t } = useTranslation();
  const example = buildCurlExample(endpoint);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
            {endpoint.method}
          </span>
          <code className="text-sm">{endpoint.path}</code>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {t(`publicApi.endpoints.${endpoint.id}.description`)}
        </p>

        {endpoint.query?.length ? (
          <div className="mt-4">
            <p className="text-sm font-medium">
              {t("publicApi.endpoint.queryParams")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {endpoint.query.map((item) => (
                <code
                  key={item}
                  className="rounded-md bg-muted px-2 py-1 text-xs"
                >
                  {item}
                </code>
              ))}
            </div>
          </div>
        ) : null}

        {endpoint.body ? (
          <div className="mt-4">
            <p className="text-sm font-medium">
              {t("publicApi.endpoint.jsonBody")}
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-muted p-4 text-xs">
              {JSON.stringify(endpoint.body, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">
            {t("publicApi.endpoint.copyableExample")}
          </p>
          <Button variant="outline" onClick={() => void onCopy(example)}>
            <Copy className="mr-2 h-4 w-4" />
            {copiedText === example
              ? t("publicApi.actions.copied")
              : t("publicApi.actions.copy")}
          </Button>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-muted p-4 text-xs">
          {example}
        </pre>
      </div>
    </div>
  );
}
