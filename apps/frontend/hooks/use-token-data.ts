"use client";

import { useCallback, useEffect, useState } from "react";
import { PWRC_PUBLIC_DATA, type PwrcPublicPayload } from "../lib/token-data";

type State = {
  data: PwrcPublicPayload;
  loading: boolean;
  error: string | null;
};

export function useTokenData(apiBase = "") {
  const [state, setState] = useState<State>({
    data: PWRC_PUBLIC_DATA,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState(current => ({ ...current, loading: true, error: null }));
    try {
      const response = await fetch(`${apiBase}/api/v1/token`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Token data request failed (${response.status})`);
      const data = (await response.json()) as PwrcPublicPayload;
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: PWRC_PUBLIC_DATA,
        loading: false,
        error: error instanceof Error ? error.message : "Token data unavailable",
      });
    }
  }, [apiBase]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { ...state, refresh };
}
