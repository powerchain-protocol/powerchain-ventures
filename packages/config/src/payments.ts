export type PaymentEnvironment = Record<string, string | undefined>;

export type PaymentMethodId =
  | "sol-pwrc"
  | "solana-pay"
  | "coinbase-onramp"
  | "stripe"
  | "usdc"
  | "cctp-usdc"
  | "sui"
  | "zk-compressed";

export type PaymentMethodConfig = {
  id: PaymentMethodId;
  label: string;
  description: string;
  enabled: boolean;
  settlement:
    | "purchase"
    | "funding"
    | "disabled";
  network:
    | "solana"
    | "cross-chain"
    | "sui";
  asset:
    | "SOL"
    | "USDC"
    | "SUI";
  destinationAsset:
    | "PWRC"
    | "SOL"
    | "USDC";
  provider?: string;
};

function flag(
  value: string | undefined,
  fallback = false,
) {
  if (
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value === "1" ||
    value === "true";
}

/**
 * SOL -> PWRC is always the primary purchase rail.
 * Every other rail is explicit opt-in and fail-closed by default.
 */
export function paymentMethods(
  env:
    PaymentEnvironment =
      ((globalThis as typeof globalThis & { process?: { env?: PaymentEnvironment } }).process?.env ?? {}),
): readonly PaymentMethodConfig[] {
  return [
    {
      id: "sol-pwrc",
      label: "SOL → PWRC",
      description:
        "Default PowerChain purchase. Buyer signs the exact Launchpad transaction.",
      enabled: true,
      settlement:
        "purchase",
      network: "solana",
      asset: "SOL",
      destinationAsset:
        "PWRC",
    },
    {
      id: "solana-pay",
      label: "Solana Pay QR",
      description:
        "Solana Pay transaction-request QR for the same SOL → PWRC purchase.",
      enabled: flag(
        env
          .NEXT_PUBLIC_SOLANA_PAY_ENABLED,
        true,
      ),
      settlement:
        "purchase",
      network: "solana",
      asset: "SOL",
      destinationAsset:
        "PWRC",
      provider:
        "Solana Pay",
    },
    {
      id: "coinbase-onramp",
      label: "Fund SOL",
      description:
        "Hosted Coinbase onramp. Funding is separate from token settlement.",
      enabled: flag(
        env
          .NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED,
        false,
      ),
      settlement:
        "funding",
      network: "solana",
      asset: "SOL",
      destinationAsset:
        "SOL",
      provider:
        "Coinbase",
    },
    {
      id: "stripe",
      label: "Card / Stripe",
      description:
        "Optional provider-hosted card rail. Disabled until configured.",
      enabled: flag(
        env
          .NEXT_PUBLIC_STRIPE_ENABLED,
        false,
      ),
      settlement:
        flag(
          env
            .NEXT_PUBLIC_STRIPE_ENABLED,
          false,
        )
          ? "funding"
          : "disabled",
      network: "solana",
      asset: "SOL",
      destinationAsset:
        "SOL",
      provider:
        "Stripe",
    },
    {
      id: "usdc",
      label: "USDC",
      description:
        "Native SPL USDC purchase adapter.",
      enabled: flag(
        env
          .NEXT_PUBLIC_USDC_PURCHASE_ENABLED,
        false,
      ),
      settlement:
        flag(
          env
            .NEXT_PUBLIC_USDC_PURCHASE_ENABLED,
          false,
        )
          ? "purchase"
          : "disabled",
      network: "solana",
      asset: "USDC",
      destinationAsset:
        "PWRC",
    },
    {
      id: "cctp-usdc",
      label: "CCTP V2 USDC",
      description:
        "Cross-chain USDC funding through Circle CCTP V2.",
      enabled: flag(
        env
          .NEXT_PUBLIC_CCTP_ENABLED,
        false,
      ),
      settlement:
        "funding",
      network:
        "cross-chain",
      asset: "USDC",
      destinationAsset:
        "USDC",
      provider:
        "Circle CCTP V2",
    },
    {
      id: "sui",
      label: "SUI",
      description:
        "Sui purchase adapter.",
      enabled: flag(
        env
          .NEXT_PUBLIC_SUI_PURCHASE_ENABLED,
        false,
      ),
      settlement:
        flag(
          env
            .NEXT_PUBLIC_SUI_PURCHASE_ENABLED,
          false,
        )
          ? "purchase"
          : "disabled",
      network: "sui",
      asset: "SUI",
      destinationAsset:
        "PWRC",
    },
    {
      id: "zk-compressed",
      label: "ZK compressed",
      description:
        "Optional Solana ZK Compression payment state / nullifier capability.",
      enabled: flag(
        env
          .NEXT_PUBLIC_ZK_COMPRESSION_ENABLED,
        false,
      ),
      settlement:
        "disabled",
      network: "solana",
      asset: "SOL",
      destinationAsset:
        "PWRC",
      provider:
        "Light Protocol",
    },
  ] as const;
}

export function defaultPaymentMethod() {
  return "sol-pwrc" as const;
}
