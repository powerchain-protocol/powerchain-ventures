import type { WalletConnectionStatus } from "./status";

export type WalletProviderKind = "wallet-standard" | "embedded";

export type WalletProviderOption = {
  id: string;
  name: string;
  kind: WalletProviderKind;
  ready: boolean;
  recommended?: boolean;
  description?: string;
};

export type ConnectedWallet = {
  address: string;
  displayAddress: string;
  providerName?: string;
  status: WalletConnectionStatus;
  cluster: "devnet" | "mainnet-beta";
};

export type WalletActionState = {
  status: WalletConnectionStatus;
  error: string | null;
  activeProviderId: string | null;
};

export function shortenWalletAddress(address: string, prefix = 6, suffix = 6): string {
  if (address.length <= prefix + suffix + 1) return address;
  return `${address.slice(0, prefix)}…${address.slice(-suffix)}`;
}
