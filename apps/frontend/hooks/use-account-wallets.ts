"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  accountService,
} from "../services/account-service";
import type {
  AccountWallet,
} from "../types/accounts";

export function useAccountWallets() {
  const [wallets, setWallets] =
    useState<AccountWallet[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const refresh =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const result =
          await accountService.wallets();
        setWallets(
          result.wallets,
        );
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load linked wallets",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const unlink =
    useCallback(
      async (
        chain: "solana" | "sui",
        address: string,
      ) => {
        await accountService.unlinkWallet(
          chain,
          address,
        );
        await refresh();
      },
      [refresh],
    );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    wallets,
    loading,
    error,
    refresh,
    unlink,
  };
}
