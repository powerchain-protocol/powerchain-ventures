import type { PowerChainFeePolicy, PwrcPublicPayload, PwrcTokenData } from "./types.js";

export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

export const PWRC_TOKEN: PwrcTokenData = Object.freeze({
  id: "pwrc",
  name: "PowerChain",
  symbol: "PWRC",
  version: "1.0.0",
  chain: "solana",
  cluster: "mainnet-beta",
  tokenStandard: "SPL Token-2022",
  tokenProgramId: TOKEN_2022_PROGRAM_ID,
  decimals: 9,
  totalSupplyTokens: "18446000000",
  totalSupplyBaseUnits: "18446000000000000000",
  deploymentStatus: "configuration-ready",
  mintAddress: null,
  metadataAddress: null,
  enabledExtensions: ["MetadataPointer", "TokenMetadata"],
  disabledExtensions: [
    "TransferFeeConfig",
    "PermanentDelegate",
    "MintCloseAuthority",
    "DefaultAccountState",
    "InterestBearingConfig",
    "ScaledUiAmountConfig",
    "PausableConfig",
  ],
  authorities: {
    mintAuthorityPolicy: "mint-full-supply-once-then-revoke",
    postGenesisMintAuthority: null,
    freezeAuthority: null,
  },
});

export const POWERCHAIN_FEE_POLICY: PowerChainFeePolicy = Object.freeze({
  feeWallet: "FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy",
  purchaseServiceFeeBps: 250,
  purchaseServiceFeePercent: "2.5",
  claimServiceFeeBps: 0,
  walletTransferServiceFeeBps: 0,
  creatorLifecycleServiceFeeBps: 0,
});

export function createPwrcPublicPayload(updatedAt = "2026-08-15"): PwrcPublicPayload {
  return Object.freeze({
    token: PWRC_TOKEN,
    feePolicy: POWERCHAIN_FEE_POLICY,
    source: "powerchain-token-data",
    schemaVersion: 1,
    updatedAt,
  });
}

export const PWRC_PUBLIC_DATA = createPwrcPublicPayload();

export function assertPwrcSupplyInvariant(): true {
  const expected = BigInt(PWRC_TOKEN.totalSupplyTokens) * 10n ** BigInt(PWRC_TOKEN.decimals);
  if (expected !== BigInt(PWRC_TOKEN.totalSupplyBaseUnits)) {
    throw new Error("PWRC supply invariant violated");
  }
  return true;
}
