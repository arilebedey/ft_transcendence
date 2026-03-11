import { useState, useEffect, useRef } from "react";
import { Sliders } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";

interface UserResult {
  id: string;
  name: string;
}

interface SearchBarProps {
  onSelectUser?: (id: string | null) => void;
  onFilterChange?: (filter: 'recent' | 'oldest' | 'most_liked') => void;
}

export function SearchBar( { onSelectUser, onFilterChange }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [filter, setFilter] = useState<'recent' | 'oldest' | 'most_liked'>('recent');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const fetchUsers = async (q: string): Promise<UserResult[]> => {
    if (!q.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        console.error("Search failed");
        return [];
      }

      const data: UserResult[] = await res.json();
      setResults(data);

      return data;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (onSelectUser) {
      if (results.length > 0) {
        onSelectUser(results[0].id);
      } else {
        onSelectUser(null);
      }
    }
  }, [results, onSelectUser]);


  /*useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);*/

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
  
      if (containerRef.current && !containerRef.current.contains(target)) {
        setShowDropdown(false);
      }
 
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(target)) {
        setShowFilterDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);

    const debounce = setTimeout(() => {
      fetchUsers(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      setShowDropdown(false);
      return;
    }

    if (e.key !== "Enter") return;

    e.preventDefault();

    const users = await fetchUsers(query);

    const exactMatch = users.find(
      (user) => user.name.toLowerCase() === query.trim().toLowerCase()
    );

    if (exactMatch) {
      goToProfile(exactMatch.name);
    }
  };

  const goToProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-[400px] md:w-[600px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      <Input
        type="search"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query && setShowDropdown(true)}
        className="pl-12 h-12 text-base rounded-full bg-secondary border-none focus-visible:ring-primary"
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setShowFilterDropdown(prev => !prev)}
          className="h-10 px-3 rounded-lg border bg-background text-sm hover:bg-accent/10"
        >
          <Sliders className="h-4 w-4" />
        </button>

        {showFilterDropdown && (
          <div 
            className="absolute right-0 mt-2 w-44 z-50"
            ref={filterDropdownRef}
          >
            <ListCard title="Sort by">
              <ListItem
                primary="Most Recent"
                action={filter === 'recent' ? "✓" : undefined}
                onClick={() => {
                  setFilter('recent');
                  setShowFilterDropdown(false);
                  if (onFilterChange) onFilterChange('recent');
                }}
              />
              <ListItem
                primary="Oldest"
                action={filter === 'oldest' ? "✓" : undefined}
                onClick={() => {
                  setFilter('oldest');
                  setShowFilterDropdown(false);
                  if (onFilterChange) onFilterChange('oldest');
                }}
              />
              <ListItem
                primary="Most Liked"
                action={filter === 'most_liked' ? "✓" : undefined}
                onClick={() => {
                  setFilter('most_liked');
                  setShowFilterDropdown(false);
                  if (onFilterChange) onFilterChange('most_liked');
                }}
              />
            </ListCard>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute mt-2 w-full bg-card border rounded-xl shadow-lg overflow-hidden z-50">
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              {t("NoUsersFound")}
            </div>
          )}
  
          {!loading &&
            results.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                onClick={() => goToProfile(user.name)}
                className="w-full justify-start rounded-none px-4 py-3 hover:bg-accent"
              >
                {user.name}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
