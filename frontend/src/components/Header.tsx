import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { HeaderNav } from "./HeaderNav";
import { HeaderBrand } from "./HeaderBrand";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between gap-4 h-16 px-4 max-w-4xl mx-auto">
        <HeaderBrand />
        
        <SearchBar />

        <HeaderNav />

        <LanguageToggle />

        <ThemeToggle />
        
        {/* 
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        */}
      </div>
    </header>
  );
}
