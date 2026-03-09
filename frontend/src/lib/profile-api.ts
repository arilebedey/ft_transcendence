import { z } from "zod";

export const profileMeQueryKey = ["profile", "me"] as const;

// Username validation: 3-12 chars, lowercase letters/numbers/underscore, can't start with underscore
export const usernameSchema = z
  .string()
  .min(3, "usernameMinLength")
  .max(12, "usernameMaxLength")
  .regex(/^[a-z0-9][a-z0-9_]*$/, "usernameRegex")
  .refine((name) => !name.startsWith("_"), "usernameStartsWithUnderscore")
  .transform((name) => name.toLowerCase());

export const bioSchema = z.string().max(160, "bioMaxLength");

export interface ProfileUserData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  theme: "light" | "dark-blue" | "forest";
  language: "en" | "fr" | "es" | "it";
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  language?: "en" | "fr" | "es" | "it";
}

export async function getProfileMe(): Promise<ProfileUserData> {
  const response = await fetch("/api/users/me", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to fetch profile");
  }

  return response.json();
}

export interface PublicProfileData {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export const profileByNameQueryKey = (name: string) =>
  ["profile", "user", name] as const;

export async function getProfileByName(
  name: string,
): Promise<PublicProfileData> {
  const response = await fetch(`/api/users/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "User not found");
  }

  return response.json();
}

export async function updateProfileMe(
  payload: UpdateProfilePayload,
): Promise<ProfileUserData> {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to update profile");
  }

  return response.json();
}
