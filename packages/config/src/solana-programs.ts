export const SOLANA_SYSTEM_PROGRAM_ID =
  "11111111111111111111111111111111" as const;

export const SOLANA_SPL_TOKEN_PROGRAM_ID =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" as const;

export {
  SOLANA_TOKEN_2022_PROGRAM_ID,
} from "./constants.js";

export const SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" as const;

export const SOLANA_MEMO_PROGRAM_ID =
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr" as const;

export const SOLANA_USDC_MAINNET_MINT =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" as const;

/**
 * Pyth Core on Solana is in an August 18, 2026 migration window.
 * Keep both generations explicit. New integrations should use the
 * upgraded receiver + upgraded price-feed program together with the
 * matching authenticated Pyth data endpoint.
 */
export const PYTH_SOLANA_PROGRAMS = Object.freeze({
  current: {
    wormholeReceiver:
      "HDwcJBJXjL9FpJ7UBsYBtaDjsBUhuLCUYoz3zr8SWWaQ",
    receiver:
      "rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ",
    priceFeed:
      "pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT",
  },
  upgraded: {
    wormholeReceiver:
      "HDw2E7P8X1SkCyjvoGsfBGAVUutKcj874bXjHrpVYrVL",
    receiver:
      "rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp",
    priceFeed:
      "pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou",
  },
  upgradeDate:
    "2026-08-18T00:00:00Z",
} as const);

export type PythCoreGeneration =
  keyof Pick<
    typeof PYTH_SOLANA_PROGRAMS,
    "current" | "upgraded"
  >;

export function pythSolanaPrograms(
  generation:
    PythCoreGeneration =
      "upgraded",
) {
  return PYTH_SOLANA_PROGRAMS[
    generation
  ];
}

/** Circle CCTP V2 Solana domain and deployed V2 programs. */
export const CCTP_V2_SOLANA = Object.freeze({
  domain: 5,
  messageTransmitter:
    "CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC",
  tokenMessengerMinter:
    "CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe",
} as const);

/**
 * Light Protocol reference nullifier utility. ZK Compression remains
 * capability-gated; this constant does not enable compressed payments.
 */
export const LIGHT_NULLIFIER_PROGRAM_ID =
  "NFLx5WGPrTHHvdRNsidcrNcLxRruMC92E4yv7zhZBoT" as const;
