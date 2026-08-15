import { useCallback, useEffect, useState } from "react";
import { fetchPublicData, publicDataFallback } from "../services/public-data";
import type { PowerChainPublicRegistry, PublicDataEnvelope } from "@powerchain/token-data";

export function usePublicData(apiBaseUrl: string) {
  const [data, setData] =
    useState<PublicDataEnvelope<PowerChainPublicRegistry>>(publicDataFallback());
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    setLoading(true);
    setError(null);
    try {
      setData(await fetchPublicData(apiBaseUrl, controller.signal));
      setStale(false);
    } catch (cause) {
      setData(publicDataFallback());
      setStale(true);
      setError(cause instanceof Error ? cause.message : "Public data unavailable");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, stale, error, refresh };
}
