"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchJson } from "../lib/helpers";

export type DeploymentState = {
  configured: boolean;
  missing: string[];
  invalid: string[];
  presaleMintConfigured: boolean;
  presaleVaultConfigured: boolean;
  presaleVaultAuthorityConfigured: boolean;
  treasuryConfigured: boolean;
};

export type LaunchpadConfig = {
  name: string;
  version: string;
  cluster: "devnet" | "mainnet-beta";
  serviceFeeBps: number;
  feeWallet: string;
  launchpadProgramId: string | null;
  launchpadProgramIdConfigured: boolean;
  integrations: { heliusConfigured: boolean; birdeyeConfigured: boolean; heliusRpcBase: string; birdeyeBaseUrl: string };
  tokenProgram: string;
  tokenProgramId: string;
  explorerBaseUrl: string;
  quoteTtlSeconds: number;
  deployment: DeploymentState;
  presale: {
    allocationTokens: string;
    startsAt: string | null;
    endsAt: string | null;
    claimStartsAt: string | null;
    priceUsd: string | null;
    minPurchaseUsd: string | null;
    maxPurchaseUsd: string | null;
    mint: string | null;
    vaultTokenAccount: string | null;
    vaultAuthority: string | null;
    treasuryWallet: string | null;
    defaultDurationDays: number;
  };
};

type PowerChainConfigContextValue = {
  config: LaunchpadConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  mainnetReady: boolean;
};

const PowerChainConfigContext = createContext<PowerChainConfigContextValue | null>(null);

export function PowerChainConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<LaunchpadConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError(null);

    try {
      const body = await fetchJson<LaunchpadConfig>(
        "/api/v1/launchpad/config",
        { signal: controller.signal, retries: 1, timeoutMs: 10_000 },
        "Unable to load PowerChain configuration",
      );
      if (!controller.signal.aborted) setConfig(body);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setConfig(null);
      setError(cause instanceof Error ? cause.message : "Unable to load PowerChain configuration");
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => activeRequest.current?.abort();
  }, [refresh]);

  const value = useMemo<PowerChainConfigContextValue>(() => ({
    config,
    loading,
    error,
    refresh,
    mainnetReady: Boolean(config?.cluster === "mainnet-beta" && config.deployment.configured),
  }), [config, loading, error, refresh]);

  return <PowerChainConfigContext.Provider value={value}>{children}</PowerChainConfigContext.Provider>;
}

export function usePowerChainConfig(): PowerChainConfigContextValue {
  const value = useContext(PowerChainConfigContext);
  if (!value) throw new Error("usePowerChainConfig must be used inside PowerChainConfigProvider");
  return value;
}
