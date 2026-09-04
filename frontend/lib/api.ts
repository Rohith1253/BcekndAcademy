/**
 * Centralized API Client for Backend Learning Academy
 * Resolves API requests to the Express backend (http://localhost:5000/api)
 * Safely handles JSON parsing, SSR safety, and authentication tokens.
 */

export function getBaseApiUrl(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").trim();
  // Strip trailing slashes
  base = base.replace(/\/+$/, "");
  // Ensure the base URL ends with /api
  if (!base.endsWith("/api")) {
    base = `${base}/api`;
  }
  return base;
}

export function getApiUrl(path: string): string {
  const base = getBaseApiUrl();
  let cleanPath = (path || "").trim();

  // Ensure leading slash
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // If path is root /api or starts with /api/, strip the /api prefix
  // because getBaseApiUrl() already ends with /api
  if (cleanPath === "/api") {
    return base;
  }
  if (cleanPath.startsWith("/api/")) {
    cleanPath = cleanPath.substring(4); // e.g. "/api/games" -> "/games"
  }

  return `${base}${cleanPath}`;
}

/**
 * Safely retrieves the authentication token without throwing ReferenceError
 * in Next.js server-side / SSR environments.
 */
export function getAuthToken(): string | undefined {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const token = localStorage.getItem("token");
      if (token) return token;
    } catch {}
  }

  if (typeof document !== "undefined") {
    try {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (match) {
        return match.split("=")[1];
      }
    } catch {}
  }

  return undefined;
}

/**
 * Returns authorization headers if a token is available.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Safe response handler:
 * - Avoids double body consumption (uses response.clone() before reading).
 * - Uses Content-Type detection.
 * - Safely handles non-JSON / HTML error responses.
 */
export async function handleResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  // Clone response so body can be inspected safely without consuming stream twice
  const resClone = res.clone();

  let data: any = null;
  let textFallback = "";

  if (isJson) {
    try {
      data = await res.json();
    } catch {
      // In case JSON parsing fails despite content-type header, read from clone
      try {
        textFallback = await resClone.text();
      } catch {
        textFallback = "";
      }
    }
  } else {
    try {
      textFallback = await res.text();
    } catch {
      textFallback = "";
    }
  }

  if (!res.ok) {
    const errorMessage =
      data?.error ||
      data?.message ||
      (textFallback ? textFallback.slice(0, 300) : `HTTP Error ${res.status}: ${res.statusText}`);
    throw new Error(errorMessage);
  }

  if (data !== null) {
    return data as T;
  }

  if (textFallback) {
    try {
      return JSON.parse(textFallback) as T;
    } catch {
      throw new Error(`Expected JSON response, but received ${contentType || "text"}`);
    }
  }

  return data as T;
}

/**
 * Core fetch wrapper with URL normalization, credentials, and headers.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const fullUrl = getApiUrl(path);

  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(init.headers as Record<string, string>),
  };

  return fetch(fullUrl, {
    ...init,
    headers,
    credentials: init.credentials || "include",
  });
}

/**
 * Centralized API client object
 */
export const api = {
  get: async <T = any>(path: string, init?: RequestInit): Promise<T> => {
    const res = await apiFetch(path, { ...init, method: "GET" });
    return handleResponse<T>(res);
  },

  post: async <T = any>(path: string, body?: any, init?: RequestInit): Promise<T> => {
    const headers: Record<string, string> = {};
    if (body !== undefined && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await apiFetch(path, {
      ...init,
      method: "POST",
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  put: async <T = any>(path: string, body?: any, init?: RequestInit): Promise<T> => {
    const headers: Record<string, string> = {};
    if (body !== undefined && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await apiFetch(path, {
      ...init,
      method: "PUT",
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  patch: async <T = any>(path: string, body?: any, init?: RequestInit): Promise<T> => {
    const headers: Record<string, string> = {};
    if (body !== undefined && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await apiFetch(path, {
      ...init,
      method: "PATCH",
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  delete: async <T = any>(path: string, init?: RequestInit): Promise<T> => {
    const res = await apiFetch(path, { ...init, method: "DELETE" });
    return handleResponse<T>(res);
  },
};

export default api;
