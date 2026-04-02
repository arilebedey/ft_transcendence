import { useState, useEffect, useRef } from "react";
import { Sliders, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { getProfileByName, profileByNameQueryKey } from "@/lib/profile-api";
import { useQuery, useQueries } from "@tanstack/react-query";

interface UserResult {
  id: string;
  name: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: "recent" | "oldest" | "most_liked") => void;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"recent" | "oldest" | "most_liked">(
    "recent",
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const getCurrentAtWord = () => {
    const el = inputRef.current;
    if (!el) return "";
    const pos = el.selectionStart ?? 0;
    const textBeforeCursor = el.value.slice(0, pos);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    return currentWord.startsWith("@") ? currentWord.slice(1) : "";
  };

  const searchQuery = getCurrentAtWord();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search-users", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`,
      );
      if (!res.ok) return [];
      const data: UserResult[] = await res.json();
      return data.slice(0, 5);
    },
    staleTime: 1000 * 60,
  });

  const updateDropdownVisibility = () => {
    const el = inputRef.current;
    if (!el) return setShowDropdown(false);

    const pos = el.selectionStart ?? 0;
    const textBeforeCursor = el.value.slice(0, pos);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    setShowDropdown(currentWord.startsWith("@"));
  };

  const profileQueries = useQueries({
    queries: users.map((user) => ({
      queryKey: profileByNameQueryKey(user.name),
      queryFn: () => getProfileByName(user.name),
      staleTime: 1000 * 60,
    })),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProfile = (name: string) => {
    navigate(`/profile/${name}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      setShowDropdown(false);
    }

    if (e.key === "Enter") {
      setShowDropdown(false);
      onSearch?.(query.trim());
    }
  };

  function rankUser(name: string, query: string) {
    const n = name.toLowerCase();
    const q = query.toLowerCase();

    if (!n.includes(q)) return Infinity;

    if (n.startsWith(q)) return 0;

    const separatorMatch = n.match(/[_\-\s.]/);
    if (separatorMatch) {
      const index = separatorMatch.index ?? -1;
      if (n.slice(index + 1).startsWith(q)) return 1;
    }

    return n.indexOf(q) + 2;
  }

  const sortedUsers = users
    .map((user) => ({ ...user, rank: rankUser(user.name, searchQuery) }))
    .filter((user) => user.rank !== Infinity)
    .sort((a, b) => a.rank - b.rank);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center gap-2 sm:w-[300px] md:w-[400px] lg:w-[600px]"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        <Input
          ref={inputRef}
          type="search"
          placeholder={t("SearchPlaceholder")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateDropdownVisibility();
          }}
          onFocus={() => updateDropdownVisibility()}
          onKeyDown={handleKeyDown}
          className="pl-12 h-12 text-base rounded-full bg-secondary border-none focus-visible:ring-primary"
        />

        {showDropdown && (
          <div className="absolute left-0 mt-2 w-[calc(100%-11rem)] bg-card border rounded-xl shadow-lg overflow-hidden z-40">
            {!isLoading && sortedUsers.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {t("NoUsersFound")}
              </div>
            )}

            {sortedUsers.map((user: UserResult & { rank: number }, idx) => {
              const originalIndex = users.findIndex((u) => u.id === user.id);
              const profile = profileQueries[originalIndex]?.data;
              const name = profile?.name || user.name;
              const avatar = profile?.avatarUrl;

              return (
                <Button
                  key={user.id}
                  variant="ghost"
                  onClick={() => goToProfile(name)}
                  className="w-full justify-start rounded-none px-4 py-2 hover:bg-accent flex items-center gap-3"
                >
                  <UserAvatar
                    name={name}
                    avatarUrl={avatar}
                    className="w-8 h-8 overflow-hidden"
                  />

                  <span>{name}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilterDropdown((v) => !v)}
          aria-label={t("SortBy")}
          className="h-12 w-12 rounded-full border-border/70 bg-card/90 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-accent/20"
        >
          <Sliders className="h-4 w-4" />
        </Button>

        {showFilterDropdown && (
          <div className="absolute right-0 mt-2 w-54 z-50">
            <ListCard title={t("SortBy")}>
              <ListItem
                primary={t("MostRecent")}
                action={filter === "recent" ? "✓" : undefined}
                className="text-sm py-1.5"
                onClick={() => {
                  setFilter("recent");
                  setShowFilterDropdown(false);
                  onFilterChange?.("recent");
                }}
              />

              <ListItem
                primary={t("Oldest")}
                action={filter === "oldest" ? "✓" : undefined}
                className="text-sm py-1.5"
                onClick={() => {
                  setFilter("oldest");
                  setShowFilterDropdown(false);
                  onFilterChange?.("oldest");
                }}
              />

              <ListItem
                primary={t("MostLiked")}
                action={filter === "most_liked" ? "✓" : undefined}
                className="text-sm py-1.5"
                onClick={() => {
                  setFilter("most_liked");
                  setShowFilterDropdown(false);
                  onFilterChange?.("most_liked");
                }}
              />
            </ListCard>
          </div>
        )}
      </div>
    </div>
  );
}
