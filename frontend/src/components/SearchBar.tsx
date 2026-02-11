import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
/* import { useLanguage } from "@/contexts/LanguageContext";*/
export function SearchBar() {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("search.placeholder")}
        className="pl-10 rounded-full bg-secondary border-none focus-visible:ring-primary"
      />
    </div>
  );
}
