"use client";

import { useCallback, useEffect, useState } from "react";
import { POWERCHAIN_CAPABILITIES, type PowerChainCapabilities } from "@powerchain/token-data";

type RuntimeCapabilities = PowerChainCapabilities & {
  tokenDeploymentStatus?: string;
  tokenMintVerified?: boolean;
};

export function useCapabilities(apiBase = "") {
  const [data, setData] = useState<RuntimeCapabilities>(POWERCHAIN_CAPABILITIES);
  const [source, setSource] = useState<"network" | "fallback">("fallback");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/v1/capabilities`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Capabilities request failed (${response.status})`);
      setData((await response.json()) as RuntimeCapabilities);
      setSource("network");
      setError(null);
    } catch (cause) {
      setData(POWERCHAIN_CAPABILITIES);
      setSource("fallback");
      setError(cause instanceof Error ? cause.message : "Capabilities unavailable");
    }
  }, [apiBase]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, source, error, refresh };
}
