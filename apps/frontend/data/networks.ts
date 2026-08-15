export type NetworkId =
  | "solana-mainnet"
  | "solana-devnet"
  | "sui-mainnet"
  | "sui-testnet";

export type NetworkFamily =
  | "solana"
  | "sui";

export type NetworkDefinition = {
  id: NetworkId;
  family: NetworkFamily;
  name: string;
  shortName: string;
  environment:
    | "mainnet"
    | "devnet"
    | "testnet";
  nativeAsset: "SOL" | "SUI";
  enabled: boolean;
  settlementEnabled: boolean;
  icon: "solana" | "sui";
};

export const NETWORKS:
  readonly NetworkDefinition[] = [
    {
      id: "solana-mainnet",
      family: "solana",
      name: "Solana Mainnet",
      shortName: "Solana",
      environment: "mainnet",
      nativeAsset: "SOL",
      enabled: true,
      settlementEnabled: true,
      icon: "solana",
    },
    {
      id: "solana-devnet",
      family: "solana",
      name: "Solana Devnet",
      shortName: "Solana Devnet",
      environment: "devnet",
      nativeAsset: "SOL",
      enabled: true,
      settlementEnabled: true,
      icon: "solana",
    },
    {
      id: "sui-mainnet",
      family: "sui",
      name: "Sui Mainnet",
      shortName: "Sui",
      environment: "mainnet",
      nativeAsset: "SUI",
      enabled: true,
      settlementEnabled: false,
      icon: "sui",
    },
    {
      id: "sui-testnet",
      family: "sui",
      name: "Sui Testnet",
      shortName: "Sui Testnet",
      environment: "testnet",
      nativeAsset: "SUI",
      enabled: true,
      settlementEnabled: false,
      icon: "sui",
    },
  ] as const;

export function networkById(
  id: NetworkId,
) {
  return NETWORKS.find(
    network => network.id === id,
  );
}

export function networksByFamily(
  family: NetworkFamily,
) {
  return NETWORKS.filter(
    network =>
      network.family === family,
  );
}
