import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";

/**
 * Invisible component that re-applies the user's saved language preference
 * from the database once the profile query resolves.
 * Must be rendered inside a QueryClientProvider and only when the user is authenticated.
 */
export function UserPreferencesSync() {
  const { i18n } = useTranslation();
  const { data: profile } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profile?.language) {
      const langUpper = profile.language.toUpperCase();
      if (i18n.language !== langUpper) {
        i18n.changeLanguage(langUpper);
      }
    }
  }, [profile?.language, i18n]);

  return null;
}
