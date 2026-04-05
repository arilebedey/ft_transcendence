import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";
import {
  clearPendingLanguageSync,
  getPendingLanguageSync,
  syncPendingLanguage,
} from "@/lib/auth-language";

/**
 * Invisible component that re-applies the user's saved language preference
 * from the database once the profile query resolves.
 * Must be rendered inside a QueryClientProvider and only when the user is authenticated.
 */
export function UserPreferencesSync() {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!profile?.language) {
      return;
    }

    const pendingLanguage = getPendingLanguageSync();

    if (pendingLanguage && pendingLanguage !== profile.language) {
      void syncPendingLanguage()
        .then((updatedProfile) => {
          if (updatedProfile) {
            queryClient.setQueryData(profileMeQueryKey, updatedProfile);
          }
        })
        .catch(() => {});
      return;
    }

    if (pendingLanguage === profile.language) {
      clearPendingLanguageSync();
    }

    const langUpper = profile.language.toUpperCase();
    if (i18n.language !== langUpper) {
      i18n.changeLanguage(langUpper);
      localStorage.setItem("app-language", langUpper);
    }
  }, [profile?.language, i18n, queryClient]);

  return null;
}
