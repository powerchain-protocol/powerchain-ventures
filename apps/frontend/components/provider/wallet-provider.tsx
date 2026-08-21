"use client";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type WalletName = "Phantom" | "Solflare";
type BrowserWallet = {
  publicKey?: PublicKey;
  isConnected?: boolean;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey?: PublicKey } | void>;
  disconnect?: () => Promise<void>;
  signAndSendTransaction?: (transaction: VersionedTransaction) => Promise<{ signature: string }>;
  signTransaction?: (transaction: VersionedTransaction) => Promise<VersionedTransaction>;
  on?: (event: "connect" | "disconnect" | "accountChanged", handler: (key?: PublicKey | null) => void) => void;
  off?: (event: "connect" | "disconnect" | "accountChanged", handler: (key?: PublicKey | null) => void) => void;
};
type WalletContextValue = {
  address: string | null; walletName: WalletName | null; connected: boolean; connecting: boolean; error: string | null; modalOpen: boolean;
  setModalOpen: (value: boolean) => void; connect: (wallet: WalletName) => Promise<void>; disconnect: () => Promise<void>; signAndSendPrepared: (transactionBase64: string) => Promise<string>; connection: Connection;
};
const WalletContext = createContext<WalletContextValue | null>(null);
declare global { interface Window { solana?: BrowserWallet; phantom?: { solana?: BrowserWallet }; solflare?: BrowserWallet; } }

function getProvider(name: WalletName): BrowserWallet | undefined { return name === "Phantom" ? window.phantom?.solana || window.solana : window.solflare; }
function browserRpcUrl() {
  const configured = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "";
  if (configured && !/[?&]api-key=/i.test(configured)) return configured;
  if (configured && /[?&]api-key=/i.test(configured)) console.error("PowerChain blocked a browser RPC URL containing an API key. Use a Helius Secure RPC URL or a public Solana endpoint instead.");
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
  if (cluster === "mainnet-beta") return "https://api.mainnet-beta.solana.com";
  if (cluster === "testnet") return "https://api.testnet.solana.com";
  return "https://api.devnet.solana.com";
}
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null); const [walletName, setWalletName] = useState<WalletName | null>(null);
  const [connecting, setConnecting] = useState(false); const [modalOpen, setModalOpen] = useState(false); const [error, setError] = useState<string | null>(null);
  const activeProvider = useRef<BrowserWallet | null>(null);
  const cleanupProvider = useRef<(() => void) | null>(null);
  const connection = useMemo(() => new Connection(browserRpcUrl(), { commitment: "confirmed", wsEndpoint: process.env.NEXT_PUBLIC_SOLANA_WS_URL || undefined }), []);

  function bindProvider(provider: BrowserWallet, name: WalletName) {
    const onConnect = (key?: PublicKey | null) => { const next = key || provider.publicKey; if (next) setAddress(next.toBase58()); setWalletName(name); };
    const onDisconnect = () => { setAddress(null); setWalletName(null); };
    const onAccountChanged = (key?: PublicKey | null) => setAddress(key ? key.toBase58() : null);
    provider.on?.("connect", onConnect); provider.on?.("disconnect", onDisconnect); provider.on?.("accountChanged", onAccountChanged);
    return () => { provider.off?.("connect", onConnect); provider.off?.("disconnect", onDisconnect); provider.off?.("accountChanged", onAccountChanged); };
  }

  useEffect(() => {
    const preferred = window.localStorage.getItem("powerchain-wallet") as WalletName | null;
    if (preferred !== "Phantom" && preferred !== "Solflare") return;
    const provider = getProvider(preferred); if (!provider) return;
    activeProvider.current = provider;
    const cleanup = bindProvider(provider, preferred);
    cleanupProvider.current = cleanup;
    void provider.connect({ onlyIfTrusted: true }).then(() => { if (provider.publicKey) { setAddress(provider.publicKey.toBase58()); setWalletName(preferred); } }).catch(() => undefined);
    return () => { cleanup(); cleanupProvider.current = null; };
  }, []);

  async function connect(name: WalletName) {
    setConnecting(true); setError(null);
    try {
      const provider = getProvider(name); if (!provider) throw new Error(`${name} is not installed in this browser.`);
      cleanupProvider.current?.(); activeProvider.current = provider; cleanupProvider.current = bindProvider(provider, name); await provider.connect(); if (!provider.publicKey) throw new Error("The wallet connected without returning a public key.");
      setAddress(provider.publicKey.toBase58()); setWalletName(name); window.localStorage.setItem("powerchain-wallet", name); setModalOpen(false);
    } catch (cause) { cleanupProvider.current?.(); cleanupProvider.current = null; activeProvider.current = null; setAddress(null); setWalletName(null); setError(cause instanceof Error ? cause.message : "Unable to connect wallet."); }
    finally { setConnecting(false); }
  }
  async function signAndSendPrepared(transactionBase64: string) {
    const provider = activeProvider.current;
    if (!provider || !address) throw new Error("Connect the authorized wallet before signing.");
    const bytes = Uint8Array.from(atob(transactionBase64), (char) => char.charCodeAt(0));
    const transaction = VersionedTransaction.deserialize(bytes);
    if (provider.signAndSendTransaction) {
      const result = await provider.signAndSendTransaction(transaction);
      return result.signature;
    }
    if (provider.signTransaction) {
      const signed = await provider.signTransaction(transaction);
      return connection.sendRawTransaction(signed.serialize(), { skipPreflight: false, maxRetries: 3 });
    }
    throw new Error(`${walletName || "Wallet"} does not expose a supported signing method.`);
  }
  async function disconnect() { try { await activeProvider.current?.disconnect?.(); } finally { cleanupProvider.current?.(); cleanupProvider.current = null; activeProvider.current = null; setAddress(null); setWalletName(null); setError(null); window.localStorage.removeItem("powerchain-wallet"); } }
  return <WalletContext.Provider value={{ address, walletName, connected: Boolean(address), connecting, error, modalOpen, setModalOpen, connect, disconnect, signAndSendPrepared, connection }}>{children}</WalletContext.Provider>;
}
export function useWallet() { const value = useContext(WalletContext); if (!value) throw new Error("useWallet must be used within WalletProvider"); return value; }
