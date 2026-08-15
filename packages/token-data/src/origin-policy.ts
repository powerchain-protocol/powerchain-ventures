export function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(
  origin: string | null,
  allowedOrigins: readonly string[],
): boolean {
  if (!origin) return true; // non-browser/server-to-server request
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  return allowedOrigins.some(item => normalizeOrigin(item) === normalized);
}
