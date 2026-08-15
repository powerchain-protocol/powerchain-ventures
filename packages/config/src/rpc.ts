export type SolanaRpcProvider = "auto" | "helius" | "custom" | "solana";
export type SolanaCluster = "devnet" | "mainnet-beta";

export const SOLANA_PUBLIC_RPC = Object.freeze({
  devnet: "https://api.devnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
} satisfies Record<SolanaCluster, string>);

export const HELIUS_RPC_BASE = Object.freeze({
  devnet: "https://devnet.helius-rpc.com/",
  "mainnet-beta": "https://mainnet.helius-rpc.com/",
} satisfies Record<SolanaCluster, string>);

export const HELIUS_API_BASE = "https://api.helius.xyz" as const;

export function parseRpcProvider(value: string | undefined): SolanaRpcProvider {
  const provider = value?.trim().toLowerCase() || "auto";
  if (
    provider !== "auto" &&
    provider !== "helius" &&
    provider !== "custom" &&
    provider !== "solana"
  ) {
    throw new Error(
      "SOLANA_RPC_PROVIDER must be auto, helius, custom, or solana",
    );
  }
  return provider;
}

export function heliusRpcUrl(input: {
  cluster: SolanaCluster;
  apiKey: string;
  baseUrl?: string;
}): string {
  const key = input.apiKey.trim();
  if (!key) throw new Error("HELIUS_API_KEY is required for Helius RPC");

  const url = new URL(
    input.baseUrl?.trim() || HELIUS_RPC_BASE[input.cluster],
  );
  url.searchParams.set("api-key", key);
  return url.toString();
}

export function parseCsvUrls(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => new URL(item).toString());
}

function identity(value: string): string {
  const url = new URL(value);
  url.search = "";
  url.hash = "";
  return `${url.origin}${url.pathname}`.replace(/\/$/, "");
}

export function dedupeRpcUrls(values: readonly string[]): string[] {
  const unique = new Map<string, string>();
  for (const value of values) {
    const normalized = new URL(value).toString();
    const key = identity(normalized);
    if (!unique.has(key)) unique.set(key, normalized);
  }
  return [...unique.values()];
}

export function resolveServerRpcUrls(input: {
  cluster: SolanaCluster;
  provider: SolanaRpcProvider;
  heliusApiKey?: string;
  heliusRpcBaseUrl?: string;
  customPrimaryUrl?: string;
  customFallbackUrls?: string[];
  legacyPrimaryUrl?: string;
  legacyFallbackUrl?: string;
  legacyFallbackUrls?: string[];
  allowPublicFallback?: boolean;
}): string[] {
  const helius = input.heliusApiKey?.trim()
    ? heliusRpcUrl({
        cluster:
          input.cluster,
        apiKey:
          input.heliusApiKey,
        ...(input.heliusRpcBaseUrl
          ? {
              baseUrl:
                input.heliusRpcBaseUrl,
            }
          : {}),
      })
    : undefined;

  const custom = [
    input.customPrimaryUrl?.trim(),
    ...(input.customFallbackUrls ?? []),
  ].filter((value): value is string => Boolean(value));

  const legacy = [
    input.legacyPrimaryUrl?.trim(),
    input.legacyFallbackUrl?.trim(),
    ...(input.legacyFallbackUrls ?? []),
  ].filter((value): value is string => Boolean(value));

  let candidates: string[];
  switch (input.provider) {
    case "helius":
      if (!helius) throw new Error(
        "SOLANA_RPC_PROVIDER=helius requires HELIUS_API_KEY",
      );
      candidates = [helius, ...custom, ...legacy];
      break;
    case "custom":
      if (!custom.length) throw new Error(
        "SOLANA_RPC_PROVIDER=custom requires CUSTOM_SOLANA_RPC_URL",
      );
      candidates = [...custom, ...(helius ? [helius] : []), ...legacy];
      break;
    case "solana":
      candidates = [SOLANA_PUBLIC_RPC[input.cluster], ...legacy];
      break;
    default:
      candidates = [
        ...(helius ? [helius] : []),
        ...custom,
        ...legacy,
        ...(input.allowPublicFallback
          ? [SOLANA_PUBLIC_RPC[input.cluster]]
          : []),
      ];
      break;
  }

  if (!candidates.length) {
    throw new Error(
      "No Solana RPC configured. Configure Helius, custom RPC, or SOLANA_RPC_URL.",
    );
  }
  return dedupeRpcUrls(candidates);
}
