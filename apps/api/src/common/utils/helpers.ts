import { AppError } from "../errors.js";

export async function fetchJson<T>(url: string | URL, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const { timeoutMs = 10_000, ...requestInit } = init;
  const response = await fetch(url, { ...requestInit, signal: requestInit.signal ?? AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new AppError("upstream_http_error", `Upstream service returned HTTP ${response.status}.`, response.status === 429 ? 429 : 502);
  return response.json() as Promise<T>;
}

export function redactUrl(value: string) {
  try { const url = new URL(value); return `${url.protocol}//${url.host}${url.pathname === "/" ? "" : url.pathname}`; }
  catch { return "configured"; }
}
