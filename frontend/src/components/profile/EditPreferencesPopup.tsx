import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Trees, Moon, Sun, Globe } from "lucide-react";
import { type Theme, useThemeStore } from "@/stores/theme-store";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "forest", label: "Forest", icon: <Trees className="h-4 w-4" /> },
  {
    value: "dark-blue",
    label: "Dark Blue",
    icon: <Moon className="h-4 w-4" />,
  },
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
];

const languages = ["EN", "FR", "IT", "ES"] as const;
type Language = (typeof languages)[number];

const STORAGE_KEY = "app-language";

interface EditPreferencesPopupProps {
  onClose: () => void;
}

export function EditPreferencesPopup({ onClose }: EditPreferencesPopupProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();

  const currentLanguage = i18n.language.toUpperCase() as Language;

  const handleLanguageSelect = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-20" onClick={onClose} />

      <Card className="relative w-120 shadow-lg z-50 flex flex-col pt-6">
        <CardContent className="space-y-6 px-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>{t("Theme")}</Label>
            <div className="flex gap-2">
              {themes.map((th) => (
                <button
                  key={th.value}
                  onClick={() => setTheme(th.value)}
                  className={`flex items-center gap-2 flex-1 justify-center rounded-md border px-3 py-2 text-sm transition-colors ${
                    theme === th.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-input hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {t("Language")}
              </span>
            </Label>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    currentLanguage === lang
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-input hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center py-4">
          <Button onClick={onClose} className="px-8">
            {t("Close")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
