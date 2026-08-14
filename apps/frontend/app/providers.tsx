"use client";

import { useMemo } from "react";
import { AppProvider } from "@solana/connector/react";
import { getDefaultConfig, getDefaultMobileConfig } from "@solana/connector/headless";
import { PowerChainConfigProvider } from "../context/powerchain-config-context";
import { AuthProvider } from "../context/auth-context";
import { WALLET_CONNECTORS } from "../lib/constants";
import { getClientConfig } from "../lib/config";

export function Providers({ children }: { children: React.ReactNode }) {
  const runtime = useMemo(() => getClientConfig(), []);
  const connectorConfig = useMemo(() => getDefaultConfig({
    appName: "PowerChain Launchpad",
    appUrl: runtime.appUrl,
    autoConnect: true,
    enableMobile: true,
    clusters: [{
      id: runtime.solanaCluster === "mainnet-beta" ? "solana:mainnet" as const : "solana:devnet" as const,
      label: runtime.solanaCluster === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet",
      url: runtime.solanaRpcUrl,
    }],
    wallets: { allowList: [...WALLET_CONNECTORS], featured: [...WALLET_CONNECTORS] },
  }), [runtime]);

  const mobile = useMemo(() => getDefaultMobileConfig({
    appName: "PowerChain Launchpad",
    appUrl: runtime.appUrl,
  }), [runtime.appUrl]);

  return (
    <AppProvider connectorConfig={connectorConfig} mobile={mobile}>
      <PowerChainConfigProvider><AuthProvider>{children}</AuthProvider></PowerChainConfigProvider>
    </AppProvider>
  );
}
