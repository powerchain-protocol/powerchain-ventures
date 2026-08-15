import {
  solanaRpc,
} from "../solana-rpc";
import type {
  SolanaRpcLike,
} from "./solana-observer";

export const settlementSolanaRpc:
  SolanaRpcLike = {
  async getSignatureStatuses(
    signatures,
    config,
  ) {
    const response =
      await solanaRpc<{
        value: Array<{
          slot: number;
          confirmations:
            number | null;
          err: unknown;
          confirmationStatus?:
            | "processed"
            | "confirmed"
            | "finalized"
            | null;
        } | null>;
      }>(
        "getSignatureStatuses",
        [
          signatures,
          {
            searchTransactionHistory:
              config
                ?.searchTransactionHistory ??
              true,
          },
        ],
      );

    return response.result;
  },
};
