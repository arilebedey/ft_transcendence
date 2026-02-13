import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { UserSessionButton } from "./UserSessionButton";

interface HeaderProps {
  showSearchBar?: boolean;
  showUserSessionButton?: boolean;
}

export function Header({
  showSearchBar = true,
  showUserSessionButton = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="relative h-16 px-4">
        <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
          {showUserSessionButton ? <UserSessionButton /> : <div />}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {showSearchBar ? <SearchBar /> : <div />}
        </div>
      </div>
    </header>
  );
}
