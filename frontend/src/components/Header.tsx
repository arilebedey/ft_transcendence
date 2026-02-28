import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { UserSessionButton } from "./UserSessionButton";
import { PostCreationButton } from "./PostCreation";

interface HeaderProps {
  showSearchBar?: boolean;
  showUserSessionButton?: boolean;
  showLanguageToggle?: boolean;
  showThemeToggle?: boolean;
  showPostCreationButton?: boolean;
  onPostCreationClick?: () => void;
}

export function Header({
  showSearchBar = true,
  showUserSessionButton = true,
  showLanguageToggle = true,
  showThemeToggle = true,
  showPostCreationButton = false,
  onPostCreationClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="relative h-16 px-4">
        <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
          {showUserSessionButton ? <UserSessionButton /> : <div />}
          <div className="flex items-center gap-2">
            {showLanguageToggle && <LanguageToggle />}
            {showThemeToggle && <ThemeToggle />}
            {showPostCreationButton && onPostCreationClick && (
              <PostCreationButton onClick={onPostCreationClick} />
            )}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {showSearchBar ? <SearchBar /> : <div />}
        </div>
      </div>
    </header>
  );
}
