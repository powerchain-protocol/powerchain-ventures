import { PWRC_PUBLIC_DATA } from "./pwrc.js";
import { createPublicDataEnvelope } from "./envelope.js";

export const POWERCHAIN_PUBLIC_DATA_VERSION = 1 as const;

export const POWERCHAIN_PUBLIC_REGISTRY = Object.freeze({
  version: POWERCHAIN_PUBLIC_DATA_VERSION,
  product: "PowerChain Launchpad",
  release: "1.0.0",
  chain: "solana",
  cluster: "mainnet-beta",
  tokens: Object.freeze({
    PWRC: PWRC_PUBLIC_DATA,
  }),
});

export const POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE = createPublicDataEnvelope(
  "powerchain-public-registry",
  POWERCHAIN_PUBLIC_REGISTRY,
);

export type PowerChainPublicRegistry = typeof POWERCHAIN_PUBLIC_REGISTRY;
