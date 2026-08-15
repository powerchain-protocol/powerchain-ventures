export const POWERCHAIN_CACHE_POLICY = Object.freeze({
  publicData: Object.freeze({
    browserMaxAgeSeconds: 60,
    cdnMaxAgeSeconds: 300,
    staleWhileRevalidateSeconds: 900,
  }),
  metadata: Object.freeze({
    browserMaxAgeSeconds: 300,
    cdnMaxAgeSeconds: 3600,
    staleWhileRevalidateSeconds: 86400,
  }),
  health: Object.freeze({
    noStore: true,
  }),
  clientFreshnessMs: 5 * 60 * 1000,
});

export function publicCacheControl(
  browserMaxAgeSeconds: number,
  cdnMaxAgeSeconds: number,
  staleWhileRevalidateSeconds: number,
): string {
  return [
    "public",
    `max-age=${Math.max(0, Math.trunc(browserMaxAgeSeconds))}`,
    `s-maxage=${Math.max(0, Math.trunc(cdnMaxAgeSeconds))}`,
    `stale-while-revalidate=${Math.max(0, Math.trunc(staleWhileRevalidateSeconds))}`,
  ].join(", ");
}
