import {
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
  assertPowerChainPublicRegistryEnvelope,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "@powerchain/token-data";

export async function fetchPublicData(
  apiBaseUrl: string,
  signal?: AbortSignal,
): Promise<PublicDataEnvelope<PowerChainPublicRegistry>> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/public-data`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Public data request failed (${response.status})`);
  const payload = await response.json();
  assertPowerChainPublicRegistryEnvelope(payload);
  return payload;
}

export function publicDataFallback() {
  return POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE;
}
