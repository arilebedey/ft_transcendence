import { useState, useEffect, useRef } from "react";
import { Sliders, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";
import { getProfileByName, profileByNameQueryKey } from "@/lib/profile-api";
import { useQuery, useQueries } from "@tanstack/react-query";

interface UserResult {
  id: string;
  name: string;
}

interface SearchBarProps {
  onSelectUser?: (id: string | null) => void;
  onFilterChange?: (filter: "recent" | "oldest" | "most_liked") => void;
}

export function SearchBar({ onSelectUser, onFilterChange }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"recent" | "oldest" | "most_liked">("recent");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search-users", query],
    enabled: query.trim().length > 0,
    queryFn: async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      return res.json() as Promise<UserResult[]>;
    },
    staleTime: 1000 * 60,
  });

  const profileQueries = useQueries({
    queries: users.map((user) => ({
      queryKey: profileByNameQueryKey(user.name),
      queryFn: () => getProfileByName(user.name),
      staleTime: 1000 * 60,
    })),
  });

  useEffect(() => {
    if (!query) {
      setShowDropdown(false);
      return;
    }
    setShowDropdown(true);
  }, [query]);

  useEffect(() => {
    if (onSelectUser) {
      onSelectUser(users.length > 0 ? users[0].id : null);
    }
  }, [users, onSelectUser]);

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
      const exact = users.find(
        (u) => u.name.toLowerCase() === query.trim().toLowerCase()
      );
      if (exact) goToProfile(exact.name);
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
  .map((user) => ({
    ...user,
    rank: rankUser(user.name, query),
  }))
  .filter((user) => user.rank !== Infinity)
  .sort((a, b) => a.rank - b.rank);

  return (
    <div ref={containerRef} className="flex items-center gap-2 w-[400px] md:w-[600px] relative">

      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        <Input
          type="search"
          placeholder={t("SearchUsers")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="pl-12 h-12 text-base rounded-full bg-secondary border-none focus-visible:ring-primary"
        />

        {showDropdown && (
          <div className="absolute left-0 mt-2 w-[calc(100%-11rem)] bg-card border rounded-xl shadow-lg overflow-hidden z-40">

            {!isLoading && sortedUsers.length=== 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {t("NoUsersFound")}
              </div>
            )}

            {sortedUsers.map((user: UserResult & { rank: number }, idx) => {
              const originalIndex = users.findIndex(u => u.id === user.id);
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
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">

                    {avatar ? (
                      <img
                        src={"/storage/" + avatar}
                        alt={name}
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-bold">
                        {name.charAt(0)}
                      </span>
                    )}

                  </div>

                  <span>{name}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowFilterDropdown((v) => !v)}
          className="h-12 px-3 rounded-full border bg-background hover:bg-accent/10"
        >
          <Sliders className="h-4 w-4" />
        </button>

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
