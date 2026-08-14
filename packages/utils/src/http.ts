import { PowerChainError, parseApiError } from "./utils/errors.js";
import { clampInteger } from "./helpers.js";

export function createRequestId(prefix = "pc"): string {
  const uuid = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uuid}`;
}

export function createIdempotencyKey(scope = "request"): string {
  return `${scope}:${createRequestId("idem")}`;
}

export function parseRetryAfterMs(value: string | null, now = Date.now()): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(120_000, Math.round(seconds * 1000));
  const absolute = Date.parse(value);
  if (!Number.isFinite(absolute)) return null;
  return Math.max(0, Math.min(120_000, absolute - now));
}

export function retryDelayMs(attempt: number, retryAfterMs?: number | null): number {
  if (retryAfterMs !== undefined && retryAfterMs !== null) return clampInteger(retryAfterMs, 0, 120_000);
  const exponent = Math.min(6, Math.max(0, Math.trunc(attempt)));
  const base = Math.min(8_000, 250 * (2 ** exponent));
  return base + Math.floor(base * 0.2 * Math.random());
}

export interface FetchJsonOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  fallbackMessage?: string;
  requestId?: string;
  idempotencyKey?: string;
}

export async function fetchJsonWithPolicy<T>(input: RequestInfo | URL, options: FetchJsonOptions = {}): Promise<T> {
  const {
    timeoutMs = 15_000,
    retries = 1,
    fallbackMessage = "Request failed",
    requestId = createRequestId(),
    idempotencyKey,
    signal: callerSignal,
    ...init
  } = options;
  const method = (init.method ?? "GET").toUpperCase();
  const canRetry = method === "GET" || method === "HEAD" || Boolean(idempotencyKey);
  const maxAttempts = 1 + (canRetry ? clampInteger(retries, 0, 3) : 0);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    headers.set("x-request-id", requestId);
    if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
    if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort(callerSignal?.reason ?? new Error("request_aborted"));
    if (callerSignal?.aborted) abortFromCaller();
    else callerSignal?.addEventListener("abort", abortFromCaller, { once: true });
    const timer = setTimeout(() => controller.abort(new Error("request_timeout")), clampInteger(timeoutMs, 100, 120_000));
    try {
      const response = await fetch(input, { cache: "no-store", ...init, headers, signal: controller.signal });
      if (response.ok) return await response.json() as T;
      const error = await parseApiError(response, fallbackMessage);
      if (attempt + 1 >= maxAttempts || !error.retryable) throw error;
      const delay = retryDelayMs(attempt, parseRetryAfterMs(response.headers.get("retry-after")));
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      if (callerSignal?.aborted) throw error;
      const normalized = error instanceof PowerChainError
        ? error
        : new PowerChainError("RPC_UNAVAILABLE", error instanceof Error ? error.message : fallbackMessage, { retryable: true, cause: error });
      if (attempt + 1 >= maxAttempts || !normalized.retryable) throw normalized;
      await new Promise(resolve => setTimeout(resolve, retryDelayMs(attempt)));
    } finally {
      clearTimeout(timer);
      callerSignal?.removeEventListener("abort", abortFromCaller);
    }
  }
  throw new PowerChainError("INTERNAL_ERROR", fallbackMessage);
}
