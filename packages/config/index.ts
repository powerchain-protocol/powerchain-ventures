export const POWERCHAIN = {
  company: "PowerChain Ventures",
  brand: "PowerChain",
  tagline: "TOKENIZED RENEWABLES",
  networkLabel: "Solana",
  defaultCluster: "devnet" as const,
  defaultRpcUrl: "https://api.devnet.solana.com"
} as const;

export function publicAppUrls() {
  const api = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return {
    frontend: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_URL || "http://localhost:3001",
    api,
    /** @deprecated Use api. Kept for v1.4 environment compatibility. */
    backend: api
  };
}
