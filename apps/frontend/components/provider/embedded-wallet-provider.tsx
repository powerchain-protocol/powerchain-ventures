"use client";
import { createContext, useContext, useMemo } from "react";
import bs58 from "bs58";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors, useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

type EmbeddedWalletContextValue = {
  configured: boolean; ready: boolean; authenticated: boolean; address: string | null;
  login: () => void; logout: () => Promise<void>; signAndSendPrepared: (transactionBase64: string) => Promise<string>;
};
const disabledValue: EmbeddedWalletContextValue = { configured: false, ready: true, authenticated: false, address: null, login: () => undefined, logout: async () => undefined, signAndSendPrepared: async () => { throw new Error("Embedded wallets are not configured."); } };
const EmbeddedWalletContext = createContext<EmbeddedWalletContextValue>(disabledValue);

function rpcConfig() {
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || (cluster === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : cluster === "testnet" ? "https://api.testnet.solana.com" : "https://api.devnet.solana.com");
  const wsUrl = process.env.NEXT_PUBLIC_SOLANA_WS_URL || rpcUrl.replace(/^http/, "ws");
  const chain: "solana:mainnet" | "solana:devnet" | "solana:testnet" = cluster === "mainnet-beta" ? "solana:mainnet" : cluster === "testnet" ? "solana:testnet" : "solana:devnet";
  return { chain, rpcUrl, wsUrl };
}

function PrivyBridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const embedded = wallets.find((wallet) => wallet.walletClientType === "privy" || wallet.standardWallet?.name === "Privy") ?? null;
  async function signAndSendPrepared(transactionBase64: string) {
    if (!embedded) throw new Error("Sign in to create or access your embedded Solana wallet.");
    const bytes = Uint8Array.from(atob(transactionBase64), (char) => char.charCodeAt(0));
    const result = await signAndSendTransaction({ transaction: bytes, wallet: embedded });
    return bs58.encode(result.signature);
  }
  const value = useMemo<EmbeddedWalletContextValue>(() => ({ configured: true, ready, authenticated, address: embedded?.address ?? null, login, logout, signAndSendPrepared }), [ready, authenticated, embedded?.address, login, logout, signAndSendTransaction]);
  return <EmbeddedWalletContext.Provider value={value}>{children}</EmbeddedWalletContext.Provider>;
}

export function EmbeddedWalletProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) return <EmbeddedWalletContext.Provider value={disabledValue}>{children}</EmbeddedWalletContext.Provider>;
  const { chain, rpcUrl, wsUrl } = rpcConfig();
  return <PrivyProvider appId={appId} clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || undefined} config={{ appearance: { walletChainType: "solana-only", showWalletLoginFirst: false }, loginMethods: ["email", "wallet"], embeddedWallets: { solana: { createOnLogin: "users-without-wallets" } }, externalWallets: { solana: { connectors: toSolanaWalletConnectors({ shouldAutoConnect: true }) } }, solana: { rpcs: { [chain]: { rpc: createSolanaRpc(rpcUrl), rpcSubscriptions: createSolanaRpcSubscriptions(wsUrl) } } } }}><PrivyBridge>{children}</PrivyBridge></PrivyProvider>;
}
export function useEmbeddedWallet() { return useContext(EmbeddedWalletContext); }
