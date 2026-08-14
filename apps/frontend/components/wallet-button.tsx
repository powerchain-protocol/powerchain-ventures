"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useConnectWallet, useDisconnectWallet, useWallet, useWalletConnectors } from "@solana/connector/react";
import { WalletConnectModal } from "./wallet/wallet-connect-modal";
import { useEmbeddedWallets } from "../hooks/use-embedded-wallets";
import { usePowerChainConfig } from "../context/powerchain-config-context";
import { useClickOutside } from "../hooks/use-click-outside";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { describeWalletStatus } from "../types/status";
import { shortenWalletAddress, type WalletProviderOption } from "../types/wallets";
import { StatusBadge } from "./ui/status-badge";
import { useWalletData } from "../hooks/use-wallet-data";
import { PwrcCoin } from "./pwrc-coin";

function WalletIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="wallet-button-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h10.5A2.25 2.25 0 0 1 19 7.25v.5H6.25A2.25 2.25 0 0 0 4 10V7.25Z" fill="currentColor" opacity=".72" />
      <path d="M4 10a2.25 2.25 0 0 1 2.25-2.25h12.5A2.25 2.25 0 0 1 21 10v7.25a2.25 2.25 0 0 1-2.25 2.25H6.25A2.25 2.25 0 0 1 4 17.25V10Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.25 12.25H21v4.25h-4.75a2.125 2.125 0 1 1 0-4.25Z" fill="currentColor" opacity=".18" />
      <circle cx="16.2" cy="14.38" r=".9" fill="currentColor" />
    </svg>
  );
}

export function WalletButton() {
  const wallet = useWallet();
  const connectors = useWalletConnectors();
  const connect = useConnectWallet();
  const disconnect = useDisconnectWallet();
  const { config, mainnetReady } = usePowerChainConfig();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const embedded = useEmbeddedWallets();
  const clipboard = useCopyToClipboard();

  const address = wallet.account ? String(wallet.account) : "";
  const walletData = useWalletData(address);
  const status = wallet.isConnecting
    ? "connecting"
    : wallet.isConnected && address
      ? "connected"
      : connect.error
        ? "error"
        : "disconnected";

  const options = useMemo<WalletProviderOption[]>(() => connectors.map((connector, index) => ({
    id: connector.id,
    name: connector.name,
    kind: "wallet-standard",
    ready: connector.ready,
    recommended: index === 0 && connector.ready,
    description: connector.ready ? "Wallet Standard provider detected" : "Install or unlock this wallet",
  })), [connectors]);

  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(menuRef, closeMenu, open && Boolean(wallet.isConnected && address));

  if (wallet.isConnected && address) {
    return (
      <div className="wallet-control" ref={menuRef}>
        <button
          type="button"
          className="wallet-button connected"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open connected wallet"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <WalletIcon />
          <span className="wallet-button-label">Wallet</span>
        </button>
        {open && (
          <div className="wallet-menu" role="menu" aria-label="Connected wallet actions">
            <div className="wallet-menu-head">
              <div>
                <span className="eyebrow">Connected wallet</span>
                <strong>{shortenWalletAddress(address, 8, 8)}</strong>
              </div>
              <StatusBadge status={describeWalletStatus(status)} />
            </div>
            <code className="wallet-full-address">{address}</code>
            <div className="wallet-balance-mini">
              <span><PwrcCoin size={28}/><i><small>PWRC</small><b>{walletData.data?.pwrc.uiAmount ?? "0"}</b></i></span>
              <span><span className="mini-sol">◎</span><i><small>SOL</small><b>{walletData.data?.sol.uiAmount.toLocaleString("en-US",{maximumFractionDigits:5}) ?? "0"}</b></i></span>
            </div>
            <div className="wallet-menu-meta">
              <span><small>Network</small><b>{config?.cluster === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet"}</b></span>
              <span><small>Launchpad</small><b>{config?.cluster !== "mainnet-beta" || mainnetReady ? "Ready" : "Config incomplete"}</b></span>
            </div>
            <a className="wallet-center-link" href="/wallet">Open Wallet Center →</a>
            <div className="wallet-menu-actions">
              <button type="button" className="secondary" role="menuitem" onClick={() => void clipboard.copy(address)}>
                {clipboard.status === "copied" ? "Copied" : clipboard.status === "error" ? "Copy failed" : "Copy address"}
              </button>
              <button
                type="button"
                className="secondary danger-text"
                role="menuitem"
                onClick={() => {
                  disconnect.disconnect();
                  embedded.setSession(null);
                  setOpen(false);
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="wallet-button"
        onClick={() => setOpen(true)}
        disabled={wallet.isConnecting}
        aria-label={wallet.isConnecting ? "Connecting wallet" : "Connect wallet"}
      >
        <WalletIcon />
        <span className="wallet-button-label">{wallet.isConnecting ? "Connecting…" : "Connect Wallet"}</span>
      </button>
      <WalletConnectModal
        open={open}
        onClose={() => setOpen(false)}
        connectors={options}
        isConnecting={connect.isConnecting}
        error={connect.error?.message}
        embedded={embedded.wallets}
        onConnect={async (id) => {
          await connect.connect(id);
          setOpen(false);
        }}
      />
    </>
  );
}
