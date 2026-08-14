"use client";

import { isSolanaAddress } from "@powerchain/utils/helpers";
import type { EmbeddedWalletDescriptor, EmbeddedWalletSession } from "../types/embedded-wallets";

const SESSION_KEY = "powerchain.embedded-wallet.session.v1";

/** Discover only adapter availability. Secret key material is never read or requested here. */
export function discoverEmbeddedWallets(): EmbeddedWalletDescriptor[] {
  if (typeof window === "undefined") return [];
  const browser = Boolean((window as unknown as { solana?: unknown }).solana);
  return [{
    id: "browser-injected",
    name: "Browser wallet",
    provider: "browser",
    status: browser ? "ready" : "unavailable",
    description: "Non-custodial browser wallet adapter. PowerChain never receives private keys.",
  }];
}

function isEmbeddedWalletSession(value: unknown): value is EmbeddedWalletSession {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<EmbeddedWalletSession>;
  return typeof candidate.providerId === "string"
    && typeof candidate.address === "string"
    && isSolanaAddress(candidate.address)
    && typeof candidate.connectedAt === "string"
    && Number.isFinite(Date.parse(candidate.connectedAt));
}

export function readEmbeddedWalletSession(): EmbeddedWalletSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isEmbeddedWalletSession(parsed)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeEmbeddedWalletSession(session: EmbeddedWalletSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    assertNoSecretMaterial(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function assertNoSecretMaterial(value: unknown) {
  const text = JSON.stringify(value ?? {}).toLowerCase();
  if (/seed phrase|mnemonic|private[_ -]?key|secret[_ -]?key/.test(text)) {
    throw new Error("PowerChain embedded-wallet adapters must never accept private keys or recovery phrases");
  }
}
