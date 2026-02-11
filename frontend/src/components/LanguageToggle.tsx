/* import { useLanguage } from "@/contexts/LanguageContext"; */
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
/*   const { language, setLanguage, t } = useLanguage(); */

/*   const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };
 */
  return (
    <Button
      variant="ghost"
      size="icon"
/*       onClick={toggleLanguage} */
      className="rounded-full hover:bg-secondary"
/*       title={language === "en" ? t("language.french") : t("language.english")} */
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">
{/*         {language === "en" ? t("language.switchToFrench") : t("language.switchToEnglish")} */}
      </span>
    </Button>
  );
}
