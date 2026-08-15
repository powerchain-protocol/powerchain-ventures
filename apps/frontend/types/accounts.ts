export type AuthEngine =
  | "better-auth"
  | "wallet-signature"
  | "supabase-legacy";

export type AccountAuthType =
  | "account"
  | "wallet"
  | "linked-wallet"
  | "legacy";

export type AccountWallet = {
  address: string;
  chain: "solana" | "sui";
  provider: string;
  lastAuthenticatedAt: string | null;
};

export type PowerChainAccount = {
  id: string;
  email: string | null;
  displayName: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | null;
};

export type AccountSession = {
  configured: boolean;
  authenticated: boolean;
  engine: AuthEngine;
  authType: AccountAuthType | null;
  user: PowerChainAccount | null;
  wallets: AccountWallet[];
};

export type SocialAuthProvider =
  | "google"
  | "github"
  | "discord"
  | "apple";

export type AuthProviderConfig = {
  engine: "better-auth" | "legacy";
  emailPassword: boolean;
  wallet: boolean;
  socialProviders: SocialAuthProvider[];
  embeddedWallets: string;
};
