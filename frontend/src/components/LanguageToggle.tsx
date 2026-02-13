import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = ["EN", "FR", "IT", "ES"] as const;
type Language = (typeof languages)[number];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase() as Language;

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  return (
    <button
      onClick={cycleLanguage}
      className="inline-flex items-center h-10 gap-1.5 rounded-lg border bg-card p-1 text-sm font-medium transition-colors hover:bg-secondary"
      title={`Language: ${currentLanguage}`}
    >
      <span className="flex items-center justify-center rounded-md p-2 bg-secondary">
        <Globe className="h-4 w-4" />
      </span>
      <span className="pr-1">{currentLanguage}</span>
    </button>
  );
}
