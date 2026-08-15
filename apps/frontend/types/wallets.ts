import type {
  WalletConnectionStatus,
} from "./status";

export type WalletChain =
  | "solana"
  | "sui";

export type WalletProviderKind =
  | "wallet-standard"
  | "embedded";

export type WalletProviderOption = {
  id: string;
  name: string;
  chain?: WalletChain;
  kind: WalletProviderKind;
  ready: boolean;
  recommended?: boolean;
  description?: string;
  iconName?: string;
};

export type ConnectedWallet = {
  address: string;
  displayAddress: string;
  chain: WalletChain;
  providerName?: string;
  status: WalletConnectionStatus;
  cluster:
    | "devnet"
    | "mainnet-beta"
    | "sui-mainnet"
    | "sui-testnet";
};

export type WalletActionState = {
  status: WalletConnectionStatus;
  error: string | null;
  activeProviderId: string | null;
};

export type EmbeddedWalletAdapter = {
  id: string;
  name: string;
  chain: WalletChain;
  ready: boolean;
  connect(): Promise<{
    address: string;
  }>;
  disconnect(): Promise<void>;
};

export function shortenWalletAddress(
  address: string,
  prefix = 6,
  suffix = 6,
): string {
  if (
    address.length <=
    prefix + suffix + 1
  ) {
    return address;
  }
  return `${address.slice(
    0,
    prefix,
  )}…${address.slice(-suffix)}`;
}
