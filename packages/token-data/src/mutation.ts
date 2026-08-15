export type MutationKind =
  | "purchase"
  | "claim"
  | "creator-create-sale"
  | "creator-update-sale"
  | "creator-complete-sale"
  | "creator-cancel-sale";

export interface MutationContext {
  readonly requestId: string;
  readonly idempotencyKey: string;
  readonly fingerprint: string;
  readonly kind: MutationKind;
}

export interface MutationResult<T> {
  readonly statusCode: number;
  readonly body: T;
  readonly replayed: boolean;
}

export type MutationFailureCode =
  | "IDEMPOTENCY_REQUIRED"
  | "IDEMPOTENCY_CONFLICT"
  | "MUTATION_IN_PROGRESS"
  | "MUTATION_FAILED";
