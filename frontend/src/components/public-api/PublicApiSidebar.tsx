import { useTranslation } from "react-i18next";
import type { SectionId } from "@/components/public-api/types";

interface PublicApiSidebarProps {
  mobileView: "list" | "detail";
  sections: Array<{
    id: SectionId;
    label: string;
  }>;
  selectedSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
}

export function PublicApiSidebar({
  mobileView,
  sections,
  selectedSection,
  onSelectSection,
}: PublicApiSidebarProps) {
  const { t } = useTranslation();

  return (
    <div
      className={[
        "border-border bg-card h-full min-h-0 min-w-0 overflow-y-auto border-b md:w-[24rem] md:min-w-[24rem] md:rounded-2xl md:border",
        mobileView === "detail" ? "hidden md:block" : "block",
      ].join(" ")}
    >
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("publicApi.sidebar.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("publicApi.sidebar.description")}
          </p>
        </div>

        <div className="grid gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={[
                "w-full rounded-xl border px-3 py-3 text-left text-sm transition",
                section.id === "keys"
                  ? selectedSection === section.id
                    ? "border-emerald-700 bg-emerald-600 text-white"
                    : "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600"
                  : selectedSection === section.id
                    ? "border-foreground bg-accent text-accent-foreground"
                    : "border-border hover:bg-accent/60",
              ].join(" ")}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
