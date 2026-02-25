export const profileMeQueryKey = ["profile", "me"] as const;

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
