import { PWRC_PUBLIC_DATA, type PwrcPublicPayload } from "../lib/token-data";

export async function fetchTokenData(apiBaseUrl: string, signal?: AbortSignal): Promise<PwrcPublicPayload> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/token`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Token data request failed (${response.status})`);
  return (await response.json()) as PwrcPublicPayload;
}

export function tokenDataFallback(): PwrcPublicPayload {
  return PWRC_PUBLIC_DATA;
}
