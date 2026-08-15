import type { MutationReceipt } from "./mutation-receipt.js";

export interface MutationReceiptPersistence {
  read(mutationId: string): Promise<MutationReceipt | null>;
  create(receipt: MutationReceipt): Promise<"created" | "exists">;
  update(
    mutationId: string,
    patch: Partial<Pick<
      MutationReceipt,
      "state" | "statusCode" | "updatedAt" | "result" | "errorCode" | "replayed"
    >>,
  ): Promise<void>;
}
