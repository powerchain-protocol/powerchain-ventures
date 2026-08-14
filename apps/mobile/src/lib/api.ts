import { mobileEnv } from "./env";
import { supabase } from "./supabase";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) { super(message); }
}

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }

export async function api<T>(path: string, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const attempts = method === "GET" ? 2 : 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const { data } = await supabase.auth.getSession();
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    headers.set("x-powerchain-client", "mobile/1.0.0");
    if (data.session?.access_token) headers.set("authorization", `Bearer ${data.session.access_token}`);
    if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), mobileEnv.apiTimeoutMs);
    try {
      const response = await fetch(`${mobileEnv.apiUrl}${path}`, { ...init, headers, signal: init.signal ?? controller.signal });
      const text = await response.text();
      let payload: any = {};
      if (text) {
        try { payload = JSON.parse(text); }
        catch { throw new ApiError("PowerChain returned an invalid response", 502, "INVALID_RESPONSE"); }
      }
      if (!response.ok) {
        const error = new ApiError(payload?.error?.message || `Request failed (${response.status})`, response.status, payload?.error?.code);
        if (attempt + 1 < attempts && (response.status === 429 || response.status >= 500)) {
          await delay(450 * (attempt + 1));
          continue;
        }
        throw error;
      }
      return payload as T;
    } catch (error) {
      lastError = error;
      if (error instanceof ApiError) throw error;
      if (init.signal?.aborted) throw error;
      if (attempt + 1 < attempts) { await delay(450 * (attempt + 1)); continue; }
      if (error instanceof Error && error.name === "AbortError") throw new ApiError("Request timed out. Check your connection and try again.", 408, "TIMEOUT");
      throw new ApiError("Unable to reach PowerChain. Check your connection and try again.", 0, "NETWORK_UNAVAILABLE");
    } finally { clearTimeout(timeout); }
  }
  throw lastError instanceof Error ? lastError : new ApiError("Request failed", 0);
}
