import { Layout } from "@/components/Layout";
/* import { useLanguage } from "@/contexts/LanguageContext"; */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Info } from "lucide-react";

export const Legal = () => {
  const { t } = useLanguage();

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
    <Layout showFooter={false}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
              <p className="text-muted-foreground leading-relaxed">
                {t(section.contentKey)}
              </p>
            </CardContent>
          </Card>
        ))}

        <p className="text-center text-sm text-muted-foreground pt-4">
          {t("legal.copyright")}
        </p>
      </div>
    </Layout>
  );
};
