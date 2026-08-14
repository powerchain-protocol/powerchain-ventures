"use client";

import { useCallback, useEffect, useState } from "react";
import { discoverEmbeddedWallets, readEmbeddedWalletSession, writeEmbeddedWalletSession } from "../lib/embedded-wallets";
import type { EmbeddedWalletDescriptor, EmbeddedWalletSession } from "../types/embedded-wallets";

/** Browser-safe embedded-wallet adapter state. This hook never handles secret key material. */
export function useEmbeddedWallets() {
  const [wallets, setWallets] = useState<EmbeddedWalletDescriptor[]>([]);
  const [session, setSessionState] = useState<EmbeddedWalletSession | null>(null);

  useEffect(() => {
    const refresh = () => {
      setWallets(discoverEmbeddedWallets());
      setSessionState(readEmbeddedWalletSession());
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const setSession = useCallback((next: EmbeddedWalletSession | null) => {
    writeEmbeddedWalletSession(next);
    setSessionState(next);
  }, []);

  return { wallets, session, setSession } as const;
}
