import { useState, type ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Trees, Moon, Sun, Globe, LogOut } from "lucide-react";
import { type Theme, useThemeStore } from "@/stores/theme-store";
import { authClient } from "@/lib/auth-client";
import { profileMeQueryKey, updateProfileMe } from "@/lib/profile-api";
import { t } from "i18next";

const themes: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "forest", label: t("forest"), icon: <Trees className="h-4 w-4" /> },
  {
    value: "dark-blue",
    label: t("darkBlue"),
    icon: <Moon className="h-4 w-4" />,
  },
  { value: "light", label: t("light"), icon: <Sun className="h-4 w-4" /> },
];

const languages = ["EN", "FR", "IT", "ES"] as const;
type Language = (typeof languages)[number];

const STORAGE_KEY = "app-language";

interface EditPreferencesPopupProps {
  onClose: () => void;
}

export function EditPreferencesPopup({ onClose }: EditPreferencesPopupProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useThemeStore();

  const normalizeLanguage = (language?: string): Language => {
    const languageBase = language?.split("-")[0]?.toUpperCase();
    return languages.includes(languageBase as Language)
      ? (languageBase as Language)
      : "EN";
  };

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() =>
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language),
  );

  const { mutate: savePreferences, isPending: isSavingPreferences } =
    useMutation({
      mutationFn: ({ language }: { language: "en" | "fr" | "es" | "it" }) =>
        updateProfileMe({ language }),
      onSuccess: (updatedProfile) => {
        queryClient.setQueryData(profileMeQueryKey, updatedProfile);
        onClose();
      },
      onError: (err) => {
        console.error("Failed to save language preference:", err);
      },
    });

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const handleSave = () => {
    const language = selectedLanguage.toLowerCase() as
      | "en"
      | "fr"
      | "es"
      | "it";
    savePreferences({ language });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
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
                    selectedLanguage === lang
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

        <CardFooter className="justify-between gap-4 py-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {t("Logout")}
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="outline" className="px-8">
              {t("Close")}
            </Button>
            <Button
              onClick={handleSave}
              className="px-8"
              disabled={isSavingPreferences}
            >
              {t("save")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
