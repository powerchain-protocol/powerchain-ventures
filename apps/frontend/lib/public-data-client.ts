import {
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
  assertPowerChainPublicRegistryEnvelope,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "@powerchain/token-data";

export type PublicDataResult = {
  readonly data: PublicDataEnvelope<PowerChainPublicRegistry>;
  readonly source: "network" | "snapshot";
  readonly stale: boolean;
  readonly etag: string | null;
};

export async function fetchPublicData(
  apiBase = "",
  options: { signal?: AbortSignal; etag?: string | null } = {},
): Promise<PublicDataResult> {
  const headers = new Headers({ Accept: "application/json" });
  if (options.etag) headers.set("If-None-Match", options.etag);

  const response = await fetch(`${apiBase}/api/v1/public-data`, {
    headers,
    signal: options.signal,
    cache: "no-store",
  });

  if (response.status === 304) {
    return {
      data: POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
      source: "snapshot",
      stale: false,
      etag: options.etag ?? null,
    };
  }

  if (!response.ok) throw new Error(`Public data request failed (${response.status})`);

  const payload = await response.json();
  assertPowerChainPublicRegistryEnvelope(payload);

  return {
    data: payload,
    source: "network",
    stale: false,
    etag: response.headers.get("etag"),
  };
}

export function publicDataSnapshot(error?: unknown): PublicDataResult {
  return {
    data: POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
    source: "snapshot",
    stale: Boolean(error),
    etag: null,
  };
}
