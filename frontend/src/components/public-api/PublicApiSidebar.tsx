import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { SectionId } from "@/components/public-api/types";
import { cn } from "@/lib/utils";

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
    <Card
      className={[
        "h-full min-h-0 min-w-0 overflow-y-auto rounded-none border-x-0 border-t-0 shadow-none md:w-[24rem] md:min-w-[24rem] md:rounded-2xl",
        mobileView === "detail" ? "hidden md:block" : "block",
      ].join(" ")}
    >
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl">
            {t("publicApi.sidebar.title")}
        </CardTitle>
        <CardDescription>{t("publicApi.sidebar.description")}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2">
        <div className="grid gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              variant={selectedSection === section.id ? "default" : "outline"}
              className={cn(
                "h-auto w-full justify-start rounded-xl px-3 py-3 text-left text-sm transition",
                section.id === "keys"
                  ? selectedSection === section.id
                    ? "border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-600"
                    : "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                  : selectedSection === section.id
                    ? "border-foreground"
                    : "hover:bg-accent/60",
              )}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
