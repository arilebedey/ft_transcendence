import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="rounded-2xl shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
              {endpoint.method}
            </span>
            <code className="text-sm">{endpoint.path}</code>
          </div>
          <CardDescription className="pt-2">
            {t(`publicApi.endpoints.${endpoint.id}.description`)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {endpoint.query?.length ? (
            <div>
              <CardTitle className="text-sm font-medium">
                {t("publicApi.endpoint.queryParams")}
              </CardTitle>
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
            <div>
              <CardTitle className="text-sm font-medium">
                {t("publicApi.endpoint.jsonBody")}
              </CardTitle>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-muted p-4 text-xs">
                {JSON.stringify(endpoint.body, null, 2)}
              </pre>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <CardTitle className="text-sm font-medium">
            {t("publicApi.endpoint.copyableExample")}
          </CardTitle>
          <Button variant="outline" onClick={() => void onCopy(example)}>
            <Copy className="mr-2 h-4 w-4" />
            {copiedText === example
              ? t("publicApi.actions.copied")
              : t("publicApi.actions.copy")}
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs">
            {example}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
