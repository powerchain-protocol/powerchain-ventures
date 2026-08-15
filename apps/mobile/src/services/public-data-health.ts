export type PublicDataHealth = {
  ready: boolean;
  source: string;
  schemaVersion: number;
  release: string;
  deploymentStatus: string;
  errors: string[];
  checkedAt: string;
};

export async function fetchPublicDataHealth(
  apiBaseUrl: string,
  signal?: AbortSignal,
): Promise<PublicDataHealth> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/public-data/health`, {
    headers: { Accept: "application/json" },
    signal,
  });
  const body = (await response.json()) as PublicDataHealth;
  if (!response.ok) throw new Error(`Public data health failed (${response.status})`);
  return body;
}
