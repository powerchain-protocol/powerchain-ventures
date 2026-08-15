import type { MutationLease } from "./mutation-lease.js";

export interface MutationLeasePersistence {
  acquire(input: {
    mutationId: string;
    ownerId: string;
    leaseExpiresAt: Date;
  }): Promise<
    | { kind: "acquired"; lease: MutationLease }
    | { kind: "busy"; lease: MutationLease }
  >;

  heartbeat(input: {
    mutationId: string;
    ownerId: string;
    leaseExpiresAt: Date;
  }): Promise<boolean>;

  complete(input: {
    mutationId: string;
    ownerId: string;
  }): Promise<void>;

  fail(input: {
    mutationId: string;
    ownerId: string;
  }): Promise<void>;

  read(mutationId: string): Promise<MutationLease | null>;
}
