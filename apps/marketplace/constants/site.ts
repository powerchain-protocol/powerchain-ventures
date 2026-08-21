import { POWERCHAIN, publicAppUrls } from "@powerchain/config";
export const SITE = {
  name: "PowerChain Marketplace",
  parent: POWERCHAIN.company,
  description: "Discover wallet-controlled tokenized renewable and real-world projects on Solana.",
  urls: publicAppUrls()
} as const;
