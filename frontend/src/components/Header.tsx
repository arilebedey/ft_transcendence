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
  showSortButton?: boolean;
  onFilterChange?: (filter: 'recent' | 'oldest' | 'most_liked') => void;
  onPostCreationClick?: () => void;
  onSearch?: (query: string) => void;
}

export function Header({
  showSearchBar = true,
  showUserSessionButton = true,
  showLanguageToggle = true,
  showThemeToggle = true,
  showPostCreationButton = false,
  showSortButton = true,
  onSearch,
  onFilterChange,
  onPostCreationClick,
}: HeaderProps) {
  const showNameOnMobile =
    !showSearchBar &&
    !showLanguageToggle &&
    !showThemeToggle &&
    !showPostCreationButton;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="px-4">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          {showUserSessionButton ? (
            <UserSessionButton showNameOnMobile={showNameOnMobile} />
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            {showLanguageToggle && <LanguageToggle />}
            {showThemeToggle && <ThemeToggle />}
            {showPostCreationButton && onPostCreationClick && (
              <PostCreationButton onClick={onPostCreationClick} />
            )}
          </div>
        </div>

        {showSearchBar ? (
          <div className="mx-auto flex max-w-6xl justify-center pb-3 sm:pointer-events-none sm:absolute sm:left-1/2 sm:top-1/2 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4 sm:pb-0">
            <SearchBar
              onSearch={onSearch}
              onFilterChange={onFilterChange}
              showSortButton={showSortButton}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
