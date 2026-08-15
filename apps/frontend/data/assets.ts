export type AssetNetwork =
  | "solana"
  | "sui";

export type AssetDefinition = {
  id: string;
  symbol: "PWRC" | "SOL" | "USDC" | "SUI";
  name: string;
  network: AssetNetwork;
  decimals: number;
  native: boolean;
  icon: string;
  enabled: boolean;
};

export const ASSETS:
  readonly AssetDefinition[] = [
    {
      id: "pwrc-solana",
      symbol: "PWRC",
      name: "PowerChain",
      network: "solana",
      decimals: 9,
      native: false,
      icon: "PWRC",
      enabled: true,
    },
    {
      id: "sol-solana",
      symbol: "SOL",
      name: "Solana",
      network: "solana",
      decimals: 9,
      native: true,
      icon: "SOL",
      enabled: true,
    },
    {
      id: "usdc-solana",
      symbol: "USDC",
      name: "USD Coin",
      network: "solana",
      decimals: 6,
      native: false,
      icon: "USDC",
      enabled: true,
    },
    {
      id: "sui-sui",
      symbol: "SUI",
      name: "Sui",
      network: "sui",
      decimals: 9,
      native: true,
      icon: "SUI",
      enabled: true,
    },
  ] as const;

export function assetBySymbol(
  symbol: string,
) {
  return ASSETS.find(
    asset =>
      asset.symbol ===
      symbol.toUpperCase(),
  );
}
