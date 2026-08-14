export type CheckoutMethod = "wallet" | "card" | "onramp";

export type CheckoutMethodDefinition = {
  id: CheckoutMethod;
  label: string;
  description: string;
  badge?: string;
};

export const CHECKOUT_METHODS: readonly CheckoutMethodDefinition[] = [
  { id: "wallet", label: "Wallet", description: "Sign a reviewed Solana transaction", badge: "Recommended" },
  { id: "card", label: "Card", description: "Secure provider-hosted card checkout" },
  { id: "onramp", label: "Coinbase", description: "Fund SOL with Coinbase-hosted Onramp", badge: "Hosted" },
] as const;
