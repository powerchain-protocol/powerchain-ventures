import {
  BPS_DENOMINATOR,
  SERVICE_FEE_BPS,
  calculateServiceFee,
} from "./fees.js";

export type PaymentRail = "wallet" | "card" | "onramp";
export type PaymentAsset = "SOL" | "USDC" | "PWRC";

export interface PaymentAmount {
  asset: PaymentAsset;
  baseUnits: bigint;
  decimals: number;
}

export interface PurchaseFeeBreakdown {
  subtotalUsdMicros: bigint;
  serviceFeeUsdMicros: bigint;
  networkFeeLamports: bigint;
  totalUsdMicros: bigint;
  serviceFeeBps: bigint;
}

export const POWERCHAIN_PAYMENT_POLICY = Object.freeze({
  purchaseServiceFeeBps: SERVICE_FEE_BPS,
  claimServiceFeeBps: 0n,
  creatorActionServiceFeeBps: 0n,
  walletTransferServiceFeeBps: 0n,
});

export function purchaseFeeBreakdown(input: {
  subtotalUsdMicros: bigint;
  networkFeeLamports?: bigint;
  serviceFeeBps?: bigint;
}): PurchaseFeeBreakdown {
  if (input.subtotalUsdMicros <= 0n) {
    throw new Error("subtotalUsdMicros must be positive");
  }

  const serviceFeeBps = input.serviceFeeBps ?? SERVICE_FEE_BPS;
  if (serviceFeeBps < 0n || serviceFeeBps > BPS_DENOMINATOR) {
    throw new Error("serviceFeeBps is invalid");
  }

  const serviceFeeUsdMicros = calculateServiceFee(
    input.subtotalUsdMicros,
    serviceFeeBps,
  );

  return {
    subtotalUsdMicros: input.subtotalUsdMicros,
    serviceFeeUsdMicros,
    networkFeeLamports: input.networkFeeLamports ?? 0n,
    totalUsdMicros:
      input.subtotalUsdMicros + serviceFeeUsdMicros,
    serviceFeeBps,
  };
}

export function hasPowerChainServiceFee(
  operation:
    | "purchase"
    | "claim"
    | "creator"
    | "wallet-transfer",
): boolean {
  return operation === "purchase";
}
