"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AccountSession,
} from "../types/accounts";

export function useUsers() {
  const [data, setData] =
    useState<AccountSession | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const refresh =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/v1/auth/session",
          {
            cache: "no-store",
            credentials: "include",
          },
        );
        const body =
          await response.json();

        if (!response.ok) {
          throw new Error(
            body?.error?.message ??
              "Unable to load account",
          );
        }

        setData(body);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load account",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    user: data?.user ?? null,
    wallets:
      data?.wallets ?? [],
    authenticated:
      data?.authenticated ?? false,
    loading,
    error,
    refresh,
  };
}
