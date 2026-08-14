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
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="wallet-button-dot" />
          <span>{shortenWalletAddress(address)}</span>
          <span className="wallet-chevron" aria-hidden="true">⌄</span>
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
      <button type="button" className="wallet-button" onClick={() => setOpen(true)} disabled={wallet.isConnecting}>
        <span className="wallet-button-dot" />
        {wallet.isConnecting ? "Connecting…" : "Connect wallet"}
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
