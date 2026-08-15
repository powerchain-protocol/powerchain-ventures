"use client";

import { useCallback, useEffect, useState } from "react";

export type PublicDataHealth = {
  ready: boolean;
  source: string;
  schemaVersion: number;
  release: string;
  deploymentStatus: string;
  errors: string[];
  checkedAt: string;
};

export function usePublicDataHealth(apiBase = "") {
  const [health, setHealth] = useState<PublicDataHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/v1/public-data/health`, { cache: "no-store" });
      const body = (await response.json()) as PublicDataHealth;
      setHealth(body);
      setError(response.ok ? null : `Health check failed (${response.status})`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Health check unavailable");
    }
  }, [apiBase]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { health, error, refresh };
}
