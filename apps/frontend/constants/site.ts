import { POWERCHAIN, publicAppUrls } from "@powerchain/config";
const urls = publicAppUrls();
export const SITE = {
  name: POWERCHAIN.company,
  brand: POWERCHAIN.brand,
  descriptor: POWERCHAIN.tagline,
  description: "Wallet-controlled infrastructure for tokenized renewable and real-world capital launches on Solana.",
  urls: { frontend: urls.frontend, marketplace: urls.marketplace, api: urls.api }
} as const;
