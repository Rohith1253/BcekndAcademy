import { getApiUrl, getBaseApiUrl, getAuthHeaders, apiFetch, handleResponse, api } from "./api";

export const API_BASE_URL = getBaseApiUrl();

export { getApiUrl, getBaseApiUrl, getAuthHeaders, apiFetch, handleResponse, api };

/**
 * Fetch wrapper with AbortController timeout and exponential backoff retries.
 * Automatically targets backend API and includes credentials for HttpOnly cookies.
 */
export async function resilientApiFetch(
  path: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
  maxRetries: number = 2
): Promise<Response> {
  const fullUrl = getApiUrl(path);
  const authHeaders = getAuthHeaders();
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    },
    credentials: options.credentials || "include",
  };

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok || response.status < 500) {
        return response;
      }

      attempt++;
      if (attempt <= maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err?.name === "AbortError" ? new Error(`Request timed out after ${timeoutMs}ms`) : err;
      attempt++;
      if (attempt <= maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError || new Error(`Failed to fetch ${fullUrl} after ${maxRetries} retries`);
}
