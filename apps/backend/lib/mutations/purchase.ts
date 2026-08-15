import {
  assertUnsignedIntegerString,
  type PurchaseMutationInput,
} from "@powerchain/token-data";

export function validatePurchaseMutation(input: PurchaseMutationInput): PurchaseMutationInput {
  if (!input.saleId.trim()) throw new Error("saleId is required");
  if (!input.wallet.trim()) throw new Error("wallet is required");
  if (!input.quoteId.trim()) throw new Error("quoteId is required");
  assertUnsignedIntegerString("amountBaseUnits", input.amountBaseUnits);
  if (input.amountBaseUnits === "0") throw new Error("amountBaseUnits must be greater than zero");
  return input;
}
