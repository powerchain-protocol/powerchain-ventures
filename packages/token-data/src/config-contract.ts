export interface PublicRuntimeConfigContract {
  readonly release: "1.0.0";
  readonly network: "solana-mainnet-beta";
  readonly apiBaseUrl: string;
  readonly appUrl: string;
  readonly tokenSymbol: "PWRC";
}

export const POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS: PublicRuntimeConfigContract = Object.freeze({
  release: "1.0.0",
  network: "solana-mainnet-beta",
  apiBaseUrl: "",
  appUrl: "",
  tokenSymbol: "PWRC",
});
