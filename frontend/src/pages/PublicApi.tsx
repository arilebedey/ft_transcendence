import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ApiKeysPanel } from "@/components/public-api/ApiKeysPanel";
import { EndpointPanel } from "@/components/public-api/EndpointPanel";
import { PublicApiSidebar } from "@/components/public-api/PublicApiSidebar";
import type { SectionId } from "@/components/public-api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createApiKey,
  deleteApiKey,
  listApiKeys,
  publicApiEndpoints,
} from "@/lib/public-api";

const apiKeysQueryKey = ["public-api", "keys"] as const;

export function PublicApi() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<SectionId>("keys");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [latestCreatedKey, setLatestCreatedKey] = useState<string | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: apiKeysQueryKey,
    queryFn: listApiKeys,
  });

  const createKeyMutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeysQueryKey });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeysQueryKey });
    },
  });

  const sections = useMemo(
    () => [
      { id: "keys" as const, label: t("publicApi.sections.keys") },
      ...publicApiEndpoints.map((endpoint) => ({
        id: endpoint.id as SectionId,
        label: `${endpoint.method} ${endpoint.path}`,
      })),
    ],
    [t],
  );

  const selectedEndpoint = publicApiEndpoints.find(
    (endpoint) => endpoint.id === selectedSection,
  );

  const selectedSectionLabel = sections.find(
    (section) => section.id === selectedSection,
  )!.label;

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedText(value);
    window.setTimeout(() => setCopiedText(null), 1500);
  };

  const selectSection = (sectionId: SectionId) => {
    setSelectedSection(sectionId);
    setMobileView("detail");
  };

  const keys = data?.apiKeys ?? [];

  const handleCreateKey = async (name: string) => {
    const created = await createKeyMutation.mutateAsync(name);
    setLatestCreatedKey(created.key);
  };

  return (
    <Layout
      showSearchBar={false}
      showLanguageToggle={false}
      showThemeToggle={false}
    >
      <div className="fixed inset-x-0 top-16 bottom-16 overflow-hidden">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden px-0 py-0 md:flex-row md:gap-4 md:px-4 md:py-4">
          <PublicApiSidebar
            mobileView={mobileView}
            sections={sections}
            selectedSection={selectedSection}
            onSelectSection={selectSection}
          />

          <div
            className={[
              "h-full min-h-0 min-w-0 flex-1 overflow-y-auto md:rounded-2xl md:border md:border-border md:bg-card",
              mobileView === "list" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <div className="space-y-6 p-4 md:p-6">
              <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b bg-card px-4 py-4 md:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setMobileView("list")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="truncate text-base font-semibold text-foreground">
                  {selectedSectionLabel}
                </h1>
              </div>

              {selectedSection === "keys" ? (
                <ApiKeysPanel
                  copiedText={copiedText}
                  createKeyMutationPending={createKeyMutation.isPending}
                  deleteKeyMutationPending={deleteKeyMutation.isPending}
                  error={error instanceof Error ? error.message : null}
                  isPending={isPending}
                  keys={keys}
                  latestCreatedKey={latestCreatedKey}
                  onCopy={handleCopy}
                  onCreate={handleCreateKey}
                  onDelete={(keyId) => deleteKeyMutation.mutate(keyId)}
                />
              ) : selectedEndpoint ? (
                <EndpointPanel
                  copiedText={copiedText}
                  endpoint={selectedEndpoint}
                  onCopy={handleCopy}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
