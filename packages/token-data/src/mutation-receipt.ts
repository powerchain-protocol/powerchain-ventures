export type MutationState =
  | "accepted"
  | "processing"
  | "succeeded"
  | "failed"
  | "replayed";

export interface MutationReceipt<T = unknown> {
  readonly mutationId: string;
  readonly requestId: string;
  readonly kind: string;
  readonly state: MutationState;
  readonly statusCode: number;
  readonly replayed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly result?: T;
  readonly errorCode?: string;
}
