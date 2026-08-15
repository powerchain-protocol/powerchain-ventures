export interface PurchaseMutationInput {
  readonly saleId: string;
  readonly wallet: string;
  readonly amountBaseUnits: string;
  readonly quoteId: string;
}

export interface ClaimMutationInput {
  readonly saleId: string;
  readonly wallet: string;
}

export interface CreatorSaleMutationInput {
  readonly saleId?: string;
  readonly creatorWallet: string;
  readonly action: "create" | "update" | "complete" | "cancel";
}

export function assertUnsignedIntegerString(name: string, value: string): void {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error(`${name} must be an unsigned integer string`);
  }
}
