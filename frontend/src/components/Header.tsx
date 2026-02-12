import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { UserSessionButton } from "./UserSessionButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="grid grid-cols-3 items-center h-16 px-4 max-w-6xl mx-auto">
        <UserSessionButton />

        <div className="flex justify-center px-4">
          <SearchBar />
        </div>

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
