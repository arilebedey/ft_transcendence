import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = ["EN", "FR", "IT", "ES"] as const;
type Language = (typeof languages)[number];

const STORAGE_KEY = "app-language";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase() as Language;

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];
  
    i18n.changeLanguage(languages[nextIndex]);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
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
