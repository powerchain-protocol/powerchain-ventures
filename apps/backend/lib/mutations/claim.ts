import type { ClaimMutationInput } from "@powerchain/token-data";

export function validateClaimMutation(input: ClaimMutationInput): ClaimMutationInput {
  if (!input.saleId.trim()) throw new Error("saleId is required");
  if (!input.wallet.trim()) throw new Error("wallet is required");
  return input;
}
