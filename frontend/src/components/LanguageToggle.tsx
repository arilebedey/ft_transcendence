import { useState } from "react";
import { Globe } from "lucide-react";

type Language = "EN" | "FR" | "IT" | "ES";

const languages: Language[] = ["EN", "FR", "IT", "ES"];

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("EN");

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <button
      onClick={cycleLanguage}
      className="inline-flex items-center h-10 gap-1.5 rounded-lg border bg-card p-1 text-sm font-medium transition-colors hover:bg-secondary"
      title={`Language: ${language}`}
    >
      <span className="flex items-center justify-center rounded-md p-2 bg-secondary">
        <Globe className="h-4 w-4" />
      </span>
      <span className="pr-1">{language}</span>
    </button>
  );
}
