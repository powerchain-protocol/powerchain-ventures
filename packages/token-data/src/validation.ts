import type { PwrcPublicPayload, PwrcTokenData } from "./types.js";

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isSolanaAddressLike(value: string): boolean {
  return SOLANA_ADDRESS_RE.test(value);
}

export function validatePwrcTokenData(token: PwrcTokenData): readonly string[] {
  const errors: string[] = [];
  const expected = BigInt(token.totalSupplyTokens) * 10n ** BigInt(token.decimals);
  if (expected !== BigInt(token.totalSupplyBaseUnits)) errors.push("supply/base-unit invariant failed");
  if (token.deploymentStatus === "verified" && !token.mintAddress) errors.push("verified deployment requires mintAddress");
  if (token.mintAddress && !isSolanaAddressLike(token.mintAddress)) errors.push("mintAddress is invalid");
  if (token.metadataAddress && !isSolanaAddressLike(token.metadataAddress)) errors.push("metadataAddress is invalid");
  if (token.authorities.postGenesisMintAuthority !== null) errors.push("post-genesis mint authority must be null");
  if (token.authorities.freezeAuthority !== null) errors.push("freeze authority must be null");
  return errors;
}

export function assertPwrcPublicPayload(payload: PwrcPublicPayload): true {
  const errors = validatePwrcTokenData(payload.token);
  if (payload.feePolicy.purchaseServiceFeeBps !== 250) errors.push("purchase fee must be 250 bps");
  if (payload.feePolicy.claimServiceFeeBps !== 0) errors.push("claim fee must be 0");
  if (payload.feePolicy.walletTransferServiceFeeBps !== 0) errors.push("wallet transfer fee must be 0");
  if (errors.length) throw new Error(`Invalid PWRC public payload: ${errors.join("; ")}`);
  return true;
}
