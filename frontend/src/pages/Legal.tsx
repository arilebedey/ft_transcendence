import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
/* import { useLanguage } from "@/contexts/LanguageContext"; */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Info } from "lucide-react";

export function LegalContent({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FileText,
      titleKey: "legal.terms",
      contentKey: "legal.termsContent",
    },
    {
      icon: Shield,
      titleKey: "legal.privacy",
      contentKey: "legal.privacyContent",
    },
    {
      icon: Info,
      titleKey: "legal.about",
      contentKey: "legal.aboutContent",
    },
  ];

  return (
    <div
      className={`max-w-2xl mx-auto px-4 py-6 space-y-6 ${className}`.trim()}
    >
      {/* <h1 className="text-2xl font-bold animate-fade-in">{t("page.legal")}</h1> */}

      {sections.map((section, index) => (
        <Card
          key={section.titleKey}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <section.icon className="h-5 w-5 text-primary" />
              {t(section.titleKey)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              {(() => {
                const content = t(section.contentKey, {
                  returnObjects: true,
                }) as string | string[] | Record<string, unknown>;
                if (Array.isArray(content)) {
                  return content.map((p, i) => <p key={i}>{p}</p>);
                }
                return <p>{String(content)}</p>;
              })()}
            </div>
          </CardContent>
        </Card>
      ))}

      <p className="text-center text-sm text-muted-foreground pt-4">
        {t("legal.copyright")}
      </p>
    </div>
  );
}

export const Legal = () => {
  return (
    <Layout showFooter={false}>
      <LegalContent />
    </Layout>
  );
};
