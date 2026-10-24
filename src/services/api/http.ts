import { APP_CONFIG } from "@/config/business";
import { ApiError, type ApiErrorCode } from "@/types";

/**
 * Thin HTTP layer. Every network call in the app goes through here so that
 * timeouts, base URLs and error normalisation live in one place.
 */
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = APP_CONFIG.requestTimeoutMs,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = path.startsWith("http") ? path : `${APP_CONFIG.apiBaseUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });

    const payload = (await response.json().catch(() => null)) as
      (T & { error?: ApiErrorCode }) | null;

    if (!response.ok) {
      const code: ApiErrorCode =
        payload?.error ?? (response.status === 404 ? "not_found" : "backend_unavailable");
      throw new ApiError(code);
    }
    if (payload === null) throw new ApiError("backend_unavailable");
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new ApiError("timeout");
    throw new ApiError("network");
  } finally {
    clearTimeout(timer);
  }
}
