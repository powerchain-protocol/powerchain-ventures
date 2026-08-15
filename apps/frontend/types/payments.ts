export type PaymentNetwork =
  | "solana"
  | "sui";

export type PaymentAsset =
  | "SOL"
  | "USDC"
  | "SUI";

export type PaymentMethodKind =
  | "wallet"
  | "card"
  | "onramp";

export type PaymentAssetOption = {
  asset: PaymentAsset;
  network: PaymentNetwork;
  enabled: boolean;
  settlement:
    | "native"
    | "token"
    | "provider";
  note?: string;
};

export const PAYMENT_ASSETS:
  readonly PaymentAssetOption[] = [
    {
      asset: "SOL",
      network: "solana",
      enabled: true,
      settlement: "native",
      note:
        "Canonical reviewed Launchpad purchase settlement.",
    },
    {
      asset: "USDC",
      network: "solana",
      enabled: false,
      settlement: "token",
      note:
        "Wallet balance and transfer support are live; Launchpad purchase settlement requires a dedicated quote/verification adapter.",
    },
    {
      asset: "SUI",
      network: "sui",
      enabled: false,
      settlement: "provider",
      note:
        "Wallet connectivity is live; Launchpad settlement requires Sui finality and delivery verification.",
    },
  ] as const;
