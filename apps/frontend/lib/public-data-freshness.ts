import { POWERCHAIN_CACHE_POLICY } from "@powerchain/token-data";

export function isPublicDataFresh(
  fetchedAt: string | null,
  now = Date.now(),
): boolean {
  if (!fetchedAt) return false;
  const time = Date.parse(fetchedAt);
  if (!Number.isFinite(time)) return false;
  return now - time <= POWERCHAIN_CACHE_POLICY.clientFreshnessMs;
}
