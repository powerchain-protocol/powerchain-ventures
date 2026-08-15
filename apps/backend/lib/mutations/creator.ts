import type { CreatorSaleMutationInput } from "@powerchain/token-data";

export function validateCreatorSaleMutation(
  input: CreatorSaleMutationInput,
): CreatorSaleMutationInput {
  if (!input.creatorWallet.trim()) throw new Error("creatorWallet is required");
  if (input.action !== "create" && !input.saleId?.trim()) {
    throw new Error("saleId is required for this creator action");
  }
  return input;
}
