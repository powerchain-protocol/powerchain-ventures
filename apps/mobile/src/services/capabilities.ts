import {
  POWERCHAIN_CAPABILITIES,
  type PowerChainCapabilities,
} from "@powerchain/token-data";

export type RuntimeCapabilities = PowerChainCapabilities & {
  tokenDeploymentStatus?: string;
  tokenMintVerified?: boolean;
};

export async function fetchCapabilities(
  apiBaseUrl: string,
  signal?: AbortSignal,
): Promise<RuntimeCapabilities> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/capabilities`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Capabilities request failed (${response.status})`);
  return (await response.json()) as RuntimeCapabilities;
}

export function capabilitiesFallback(): RuntimeCapabilities {
  return POWERCHAIN_CAPABILITIES;
}
