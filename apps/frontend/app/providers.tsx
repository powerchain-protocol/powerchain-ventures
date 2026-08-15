"use client";

import { useMemo } from "react";
import { AppProvider } from "@solana/connector/react";
import { getDefaultConfig, getDefaultMobileConfig } from "@solana/connector/headless";
import { PowerChainConfigProvider } from "../context/powerchain-config-context";
import { AuthProvider } from "../context/auth-context";
import { UiProvider } from "../context/ui-context";
import { WalletProvider } from "../context/wallet-provider";
import { SuiWalletProvider } from "../context/sui-wallet-provider";
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
      <SuiWalletProvider><PowerChainConfigProvider><UiProvider><WalletProvider><AuthProvider>{children}</AuthProvider></WalletProvider></UiProvider></PowerChainConfigProvider></SuiWalletProvider>
    </AppProvider>
  );
}
