import type {
  NetworkFamily,
} from "./networks";

export type NetworkCapability =
  | "wallet-connect"
  | "balance-read"
  | "asset-transfer"
  | "sale-purchase"
  | "claim"
  | "creator-operations";

export type CapabilityState =
  | "ready"
  | "adapter-required"
  | "unsupported";

const MATRIX:
  Record<
    NetworkFamily,
    Record<
      NetworkCapability,
      CapabilityState
    >
  > = {
    solana: {
      "wallet-connect": "ready",
      "balance-read": "ready",
      "asset-transfer": "ready",
      "sale-purchase": "ready",
      claim: "ready",
      "creator-operations": "ready",
    },

    sui: {
      "wallet-connect": "ready",
      "balance-read": "ready",
      "asset-transfer":
        "adapter-required",
      "sale-purchase":
        "adapter-required",
      claim:
        "adapter-required",
      "creator-operations":
        "adapter-required",
    },
  };

export function networkCapability(
  family: NetworkFamily,
  capability: NetworkCapability,
): CapabilityState {
  return MATRIX[family][capability];
}

export function networkCan(
  family: NetworkFamily,
  capability: NetworkCapability,
): boolean {
  return (
    networkCapability(
      family,
      capability,
    ) === "ready"
  );
}
