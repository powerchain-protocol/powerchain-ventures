"use client";

import {
  useMemo,
} from "react";
import {
  AppProvider,
} from "@solana/connector/react";
import {
  getDefaultConfig,
  getDefaultMobileConfig,
} from "@solana/connector/headless";
import {
  checkoutConfig,
} from "../lib/config";

const WALLET_CONNECTORS = [
  "phantom",
  "solflare",
  "backpack",
] as const;

export function Providers({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const runtime =
    useMemo(
      () =>
        checkoutConfig(),
      [],
    );

  const connectorConfig =
    useMemo(
      () =>
        getDefaultConfig({
          appName:
            "PowerChain Checkout",
          appUrl:
            runtime.checkoutUrl,
          autoConnect: true,
          enableMobile: true,
          clusters: [
            {
              id:
                runtime.solanaCluster ===
                "mainnet-beta"
                  ? "solana:mainnet"
                  : "solana:devnet",
              label:
                runtime.solanaCluster ===
                "mainnet-beta"
                  ? "Solana Mainnet"
                  : "Solana Devnet",
              url:
                runtime.solanaRpcUrl,
            },
          ],
          wallets: {
            allowList: [
              ...WALLET_CONNECTORS,
            ],
            featured: [
              ...WALLET_CONNECTORS,
            ],
          },
        }),
      [runtime],
    );

  const mobile =
    useMemo(
      () =>
        getDefaultMobileConfig({
          appName:
            "PowerChain Checkout",
          appUrl:
            runtime.checkoutUrl,
        }),
      [
        runtime.checkoutUrl,
      ],
    );

  return (
    <AppProvider
      connectorConfig={
        connectorConfig
      }
      mobile={mobile}
    >
      {children}
    </AppProvider>
  );
}
