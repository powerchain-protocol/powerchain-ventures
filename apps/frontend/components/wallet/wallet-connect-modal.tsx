"use client";

import { useEffect, useMemo, useRef } from "react";
import type { EmbeddedWalletDescriptor } from "../../types/embedded-wallets";
import type { WalletProviderOption } from "../../types/wallets";

const FOCUSABLE = 'button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])';

export function WalletConnectModal({
  open,
  onClose,
  connectors,
  isConnecting,
  error,
  onConnect,
  embedded,
}: {
  open: boolean;
  onClose: () => void;
  connectors: WalletProviderOption[];
  isConnecting: boolean;
  error?: string;
  onConnect: (id: string) => Promise<void>;
  embedded: EmbeddedWalletDescriptor[];
}) {
  const modalRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    queueMicrotask(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const sorted = useMemo(
    () => [...connectors].sort((a, b) => Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)) || Number(b.ready) - Number(a.ready)),
    [connectors],
  );

  if (!open) return null;

  return (
    <div className="wallet-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section ref={modalRef} className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title" aria-describedby="wallet-modal-description">
        <div className="wallet-modal-head">
          <div>
            <span className="eyebrow">Solana wallet</span>
            <h2 id="wallet-modal-title">Connect to PowerChain</h2>
          </div>
          <button ref={closeRef} type="button" className="icon-button" aria-label="Close wallet dialog" onClick={onClose}>×</button>
        </div>
        <p id="wallet-modal-description" className="wallet-modal-copy">
          Use a Wallet Standard provider to participate, claim, and review transactions. PowerChain never requests private keys or recovery phrases, and never requests seed phrases.
        </p>
        <div className="wallet-security-row"><span>Non-custodial</span><span>Mainnet aware</span><span>Review before sign</span></div>
        <div className="wallet-option-list">
          {sorted.length === 0 && <div className="wallet-empty-state"><b>No wallet providers detected</b><span>Install or unlock a Wallet Standard compatible Solana wallet, then reopen this dialog.</span></div>}
          {sorted.map((connector) => (
            <button
              type="button"
              key={connector.id}
              className={`wallet-provider ${connector.recommended ? "recommended" : ""}`}
              disabled={!connector.ready || isConnecting}
              onClick={() => void onConnect(connector.id)}
            >
              <span className="wallet-provider-main">
                <span className="wallet-provider-icon" aria-hidden="true">{connector.name.slice(0, 1).toUpperCase()}</span>
                <span><b>{connector.name}</b><small>{connector.description ?? (connector.ready ? "Available in this browser" : "Not detected")}</small></span>
              </span>
              <span className="wallet-provider-action">
                {connector.recommended && <em>Recommended</em>}
                <strong>{isConnecting ? "Connecting…" : connector.ready ? "Connect" : "Unavailable"}</strong>
              </span>
            </button>
          ))}
        </div>
        {embedded.length > 0 && (
          <div className="embedded-wallets">
            <div className="wallet-section-title"><span className="eyebrow">Embedded wallet adapters</span><small>Provider-managed, never key-custodied by PowerChain</small></div>
            {embedded.map((wallet) => (
              <div className="wallet-provider static" key={wallet.id}>
                <span className="wallet-provider-main"><span className="wallet-provider-icon muted" aria-hidden="true">E</span><span><b>{wallet.name}</b><small>{wallet.description}</small></span></span>
                <strong>{wallet.status}</strong>
              </div>
            ))}
          </div>
        )}
        {error && <div className="wallet-error" role="alert"><b>Wallet connection failed</b><span>{error}</span></div>}
        <small className="wallet-safety">Only approve a transaction when the mint, recipients, instructions, token amount, and fees match the PowerChain review screen.</small>
      </section>
    </div>
  );
}
