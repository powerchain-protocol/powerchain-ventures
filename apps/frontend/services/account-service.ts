import {
  apiClient,
} from "./api-client";
import type {
  AccountWallet,
} from "../types/accounts";

export const accountService = {
  get() {
    return apiClient.get<{
      account: {
        kind: "account" | "wallet";
        userId: string | null;
        email: string | null;
        wallet: string | null;
        linkedWallets: AccountWallet[];
      };
    }>(
      "/api/v1/account",
      {
        timeoutMs: 8_000,
        retries: 0,
      },
    );
  },

  wallets() {
    return apiClient.get<{
      wallets: AccountWallet[];
    }>(
      "/api/v1/account/wallets",
      {
        timeoutMs: 8_000,
        retries: 0,
      },
    );
  },

  unlinkWallet(
    chain: "solana" | "sui",
    address: string,
  ) {
    return apiClient.delete<
      { ok: boolean; removed: boolean },
      {
        chain: "solana" | "sui";
        address: string;
      }
    >(
      "/api/v1/account/wallets",
      {
        chain,
        address,
      },
      {
        timeoutMs: 8_000,
      },
    );
  },
};
