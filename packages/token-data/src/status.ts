export type PublicDataFreshness = "fresh" | "stale" | "fallback";

export interface PublicDataClientStatus {
  readonly freshness: PublicDataFreshness;
  readonly source: "network" | "snapshot";
  readonly lastSuccessfulFetchAt: string | null;
  readonly lastAttemptAt: string | null;
  readonly error: string | null;
}

export function createInitialPublicDataClientStatus(): PublicDataClientStatus {
  return {
    freshness: "fallback",
    source: "snapshot",
    lastSuccessfulFetchAt: null,
    lastAttemptAt: null,
    error: null,
  };
}
