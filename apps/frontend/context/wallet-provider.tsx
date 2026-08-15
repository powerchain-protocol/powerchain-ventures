"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  useWallet,
} from "@solana/connector/react";
import {
  useCurrentAccount,
  useCurrentNetwork,
} from "@mysten/dapp-kit-react";
import {
  useEmbeddedWallets,
} from "../hooks/use-embedded-wallets";
import type {
  WalletChain,
} from "../types/wallets";

type WalletProviderContextValue = {
  solanaAddress: string | null;
  solanaConnected: boolean;
  suiAddress: string | null;
  suiConnected: boolean;
  suiNetwork:
    | "mainnet"
    | "testnet";
  embeddedAddress: string | null;
  activeChains: WalletChain[];
};

const WalletProviderContext =
  createContext<WalletProviderContextValue | null>(
    null,
  );

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const solana = useWallet();
  const sui =
    useCurrentAccount();
  const suiNetwork =
    useCurrentNetwork();
  const embedded =
    useEmbeddedWallets();

  const solanaAddress =
    solana.account
      ? String(solana.account)
      : null;
  const suiAddress =
    sui?.address ?? null;

  const value = useMemo(
    () => ({
      solanaAddress,
      solanaConnected:
        Boolean(solanaAddress),
      suiAddress,
      suiConnected:
        Boolean(suiAddress),
      suiNetwork:
        suiNetwork === "testnet"
          ? "testnet"
          : "mainnet",
      embeddedAddress:
        embedded.session?.address ??
        null,
      activeChains: [
        ...(solanaAddress
          ? (["solana"] as const)
          : []),
        ...(suiAddress
          ? (["sui"] as const)
          : []),
      ] as WalletChain[],
    }),
    [
      solanaAddress,
      suiAddress,
      suiNetwork,
      embedded.session?.address,
    ],
  );

  return (
    <WalletProviderContext.Provider
      value={value}
    >
      {children}
    </WalletProviderContext.Provider>
  );
}

export function useWalletProvider() {
  const value =
    useContext(WalletProviderContext);

  if (!value) {
    throw new Error(
      "useWalletProvider must be used inside WalletProvider",
    );
  }

  return value;
}
