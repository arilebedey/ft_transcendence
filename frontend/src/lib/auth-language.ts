import { updateProfileMe, type ProfileUserData } from "@/lib/profile-api";

const LANGUAGE_STORAGE_KEY = "app-language";
const PENDING_LANGUAGE_SYNC_KEY = "pending-auth-language-sync";

export type SupportedLanguage = "en" | "fr" | "it" | "es";

export function getSelectedLanguage(): SupportedLanguage {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const normalizedLanguage = savedLanguage?.split("-")[0]?.toLowerCase();

  return normalizedLanguage === "fr" ||
    normalizedLanguage === "it" ||
    normalizedLanguage === "es"
    ? normalizedLanguage
    : "en";
}

export function markPendingLanguageSync(language = getSelectedLanguage()) {
  localStorage.setItem(PENDING_LANGUAGE_SYNC_KEY, language);
}

export function clearPendingLanguageSync() {
  localStorage.removeItem(PENDING_LANGUAGE_SYNC_KEY);
}

export function getPendingLanguageSync(): SupportedLanguage | null {
  const pendingLanguage = localStorage.getItem(PENDING_LANGUAGE_SYNC_KEY);

  return pendingLanguage === "fr" ||
    pendingLanguage === "it" ||
    pendingLanguage === "es" ||
    pendingLanguage === "en"
    ? pendingLanguage
    : null;
}

export async function syncSelectedLanguage() {
  const language = getSelectedLanguage();

  try {
    await updateProfileMe({ language });
  } catch {
    markPendingLanguageSync(language);
  }
}

export async function syncPendingLanguage(): Promise<ProfileUserData | null> {
  const pendingLanguage = getPendingLanguageSync();

  if (!pendingLanguage) {
    return null;
  }

  try {
    return await updateProfileMe({ language: pendingLanguage });
  } finally {
    clearPendingLanguageSync();
  }
}

