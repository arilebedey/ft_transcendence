export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function normalizeRequestError(error: unknown): Error {
  if (error instanceof ApiError) return error;

  if (error instanceof TypeError) {
    return new Error(
      "Unable to reach the server. Check your connection and try again.",
    );
  }

  return new Error("Something went wrong. Please try again.");
}

// Wrapper for native fetch() api
async function request<T>(path: string, options?: RequestInit) {
  try {
    const res = await fetch(`/api${path}`, {
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(
        res.status,
        body.message || body.error || res.statusText,
      );
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (error) {
    throw normalizeRequestError(error);
  }
}

// Higher-order function that creates API methods for requests with a request body
function withBody(method: string) {
  return <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

// methods object for making HTTP requests to different endpoints
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: withBody("POST"),
  patch: withBody("PATCH"),
  put: withBody("PUT"),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
