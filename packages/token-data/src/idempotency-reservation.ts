export type IdempotencyReservationState =
  | "reserved"
  | "completed"
  | "failed";

export interface IdempotencyReservation {
  readonly key: string;
  readonly fingerprint: string;
  readonly state: IdempotencyReservationState;
  readonly statusCode: number | null;
  readonly body: unknown | null;
  readonly expiresAt: Date;
}

export interface AtomicIdempotencyPersistence {
  reserve(input: {
    key: string;
    fingerprint: string;
    expiresAt: Date;
  }): Promise<
    | { kind: "reserved" }
    | { kind: "existing"; value: IdempotencyReservation }
  >;

  complete(input: {
    key: string;
    fingerprint: string;
    statusCode: number;
    body: unknown;
  }): Promise<void>;

  fail(input: {
    key: string;
    fingerprint: string;
    statusCode: number;
    body: unknown;
  }): Promise<void>;

  read(key: string): Promise<IdempotencyReservation | null>;
}
