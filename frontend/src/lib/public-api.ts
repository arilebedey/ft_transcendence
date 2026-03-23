import { ApiError } from "./api";

export type PublicApiEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  query?: string[];
  body?: Record<string, unknown>;
};

export type ApiKeyListItem = {
  id: string;
  name: string | null;
  prefix: string | null;
  start: string | null;
  createdAt: string;
  expiresAt: string | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitMax: number | null;
  rateLimitTimeWindow: number | null;
};

export type CreatedApiKey = ApiKeyListItem & {
  key: string;
};

const authHeaders = {
  "Content-Type": "application/json",
};

async function authRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/auth${path}`, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorBody.message || errorBody.error || "Request failed",
    );
  }

  return response.json();
}

export async function listApiKeys(): Promise<{
  apiKeys: ApiKeyListItem[];
  total: number;
}> {
  return authRequest(
    "/api-key/list?limit=50&sortBy=createdAt&sortDirection=desc",
    { method: "GET" },
  );
}

export async function createApiKey(name: string): Promise<CreatedApiKey> {
  return authRequest("/api-key/create", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name }),
  });
}

export async function deleteApiKey(keyId: string): Promise<{ success: boolean }> {
  return authRequest("/api-key/delete", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ keyId }),
  });
}

export const publicApiEndpoints: PublicApiEndpoint[] = [
  {
    id: "list-posts",
    method: "GET",
    path: "/api/public/posts",
    description: "List posts ordered by newest first. Supports limit/offset pagination.",
    query: ["limit=20", "offset=0"],
  },
  {
    id: "list-likes",
    method: "GET",
    path: "/api/public/likes",
    description: "List likes for a post and return the total like count.",
    query: ["postId=1", "limit=20", "offset=0"],
  },
  {
    id: "list-followers",
    method: "GET",
    path: "/api/public/followers",
    description: "List followers for a user and return follower/following totals.",
    query: ["username=username_here", "limit=20", "offset=0"],
  },
  {
    id: "create-post",
    method: "POST",
    path: "/api/public/posts",
    description: "Create a new post owned by the API key's user.",
    body: {
      link: "https://example.com/article",
      content: "A short description of the shared link.",
    },
  },
  {
    id: "update-post",
    method: "PUT",
    path: "/api/public/posts/1",
    description: "Replace the editable fields of a post you own.",
    body: {
      link: "https://example.com/updated-article",
      content: "Updated content for the post.",
    },
  },
  {
    id: "delete-post",
    method: "DELETE",
    path: "/api/public/posts/1",
    description: "Delete a post you own.",
  },
];

export function buildCurlExample(endpoint: PublicApiEndpoint) {
  const query =
    endpoint.query && endpoint.query.length > 0
      ? `?${endpoint.query.join("&")}`
      : "";

  const lines = [
    `curl -X ${endpoint.method} "http://localhost:3000${endpoint.path}${query}" \\`,
    `  -H "Authorization: Bearer seenit_your_api_key_here"`,
  ];

  if (endpoint.body) {
    lines.push(`  -H "Content-Type: application/json" \\`);
    lines.push(`  -d '${JSON.stringify(endpoint.body, null, 2)}'`);
  }

  return lines.join("\n");
}
