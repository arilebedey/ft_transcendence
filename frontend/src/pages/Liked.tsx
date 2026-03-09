import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";

export const Liked = () => {
  const { t } = useTranslation();

  return (
    <Layout showThemeToggle={false} showLanguageToggle={false}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-muted-foreground">
          {t("liked.empty")}
        </div>
      </div>
    </Layout>
  );
};
