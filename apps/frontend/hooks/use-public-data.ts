"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchPublicData,
  publicDataSnapshot,
  type PublicDataResult,
} from "../lib/public-data-client";

export function usePublicData(apiBase = "") {
  const [result, setResult] = useState<PublicDataResult>(() => publicDataSnapshot());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const etag = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    setLoading(true);
    setError(null);
    try {
      const next = await fetchPublicData(apiBase, {
        signal: controller.signal,
        etag: etag.current,
      });
      etag.current = next.etag;
      setResult(next);
    } catch (cause) {
      setResult(publicDataSnapshot(cause));
      setError(cause instanceof Error ? cause.message : "Public data unavailable");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { ...result, loading, error, refresh };
}
