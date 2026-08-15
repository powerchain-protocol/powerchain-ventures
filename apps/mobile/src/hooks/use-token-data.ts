import { useCallback, useEffect, useState } from "react";
import { fetchTokenData, tokenDataFallback } from "../services/token-data";
import type { PwrcPublicPayload } from "../lib/token-data";

export function useTokenData(apiBaseUrl: string) {
  const [data, setData] = useState<PwrcPublicPayload>(tokenDataFallback());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      setData(await fetchTokenData(apiBaseUrl, controller.signal));
    } catch (cause) {
      setData(tokenDataFallback());
      setError(cause instanceof Error ? cause.message : "Token data unavailable");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh };
}
