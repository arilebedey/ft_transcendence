import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface SearchUser {
  id: string;
  name: string;
}

export function useUserSearch(query: string) {
  const [results, setResults] = useState<SearchUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null);
  const [completedQuery, setCompletedQuery] = useState<string | null>(null);
  const sanitizedQuery = query.trim().slice(0, 50);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(sanitizedQuery);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [sanitizedQuery]);

  useEffect(() => {
    if (debouncedQuery === null) return;

    let cancelled = false;

    api
      .get<SearchUser[]>(
        `/users/search?q=${encodeURIComponent(debouncedQuery)}`, // deal with spaces, special characters
      )
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setError(null);
          setCompletedQuery(debouncedQuery);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to search users",
          );
          setCompletedQuery(debouncedQuery);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return {
    results,
    // when any of these are true: loading === true
    loading:
      debouncedQuery === null ||
      debouncedQuery !== sanitizedQuery ||
      completedQuery !== debouncedQuery,
    error: completedQuery === sanitizedQuery ? error : null, // only show error for previous search
  };
}
