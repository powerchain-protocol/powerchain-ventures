import type {
  AtomicIdempotencyPersistence,
  AuditPersistence,
  IdempotencyPersistence,
  IdempotencyReservation,
  MutationReceipt,
  MutationReceiptPersistence,
  MutationLeasePersistence,
  MutationLease,
  SettlementPersistence,
  SettlementRegistrationPersistence,
  SettlementRecord,
  OutboxPersistence,
  OutboxEvent,
  RateLimitPersistence,
} from "@powerchain/token-data";

type RateEntry = { count: number; resetAt: Date };
const rates = new Map<string, RateEntry>();
const idem = new Map<string, {
  fingerprint: string;
  statusCode: number;
  body: unknown;
  expiresAt: Date;
}>();
const atomic = new Map<string, IdempotencyReservation>();
const receipts = new Map<string, MutationReceipt>();
const leases = new Map<string, MutationLease>();
const settlements = new Map<string, SettlementRecord>();

type MemoryOutbox = OutboxEvent & {
  ownerId?: string;
  leaseUntil?: number;
  state:
    | "pending"
    | "processing"
    | "completed"
    | "failed";
  lastError?: string;
  failedAt?: string;
};

const outbox =
  new Map<string, MemoryOutbox>();

export const memoryRateLimitPersistence: RateLimitPersistence = {
  async health() {},

  async consume(input) {
    const key = `${input.bucket}:${input.identityHash}`;
    const existing = rates.get(key);
    const nowMs = input.now.getTime();
    const entry = !existing || existing.resetAt.getTime() <= nowMs
      ? { count: 0, resetAt: new Date(nowMs + input.windowSeconds * 1000) }
      : existing;
    entry.count += 1;
    rates.set(key, entry);
    return {
      allowed: entry.count <= input.limit,
      remaining: Math.max(0, input.limit - entry.count),
      resetAt: entry.resetAt,
    };
  },
};

export const memoryIdempotencyPersistence: IdempotencyPersistence = {
  async read(key) {
    const value = idem.get(key);
    if (!value) return null;
    if (value.expiresAt.getTime() <= Date.now()) {
      idem.delete(key);
      return null;
    }
    return value;
  },
  async create(input) {
    if (idem.has(input.key)) return "exists";
    idem.set(input.key, input);
    return "created";
  },
};

export const memoryAtomicIdempotencyPersistence: AtomicIdempotencyPersistence = {
  async reserve(input) {
    const existing = atomic.get(input.key);
    if (existing && existing.expiresAt.getTime() > Date.now()) {
      return { kind: "existing", value: existing };
    }
    const value: IdempotencyReservation = {
      key: input.key,
      fingerprint: input.fingerprint,
      state: "reserved",
      statusCode: null,
      body: null,
      expiresAt: input.expiresAt,
    };
    atomic.set(input.key, value);
    return { kind: "reserved" };
  },

  async complete(input) {
    const existing = atomic.get(input.key);
    if (!existing || existing.fingerprint !== input.fingerprint) {
      throw new Error("Atomic idempotency reservation missing or mismatched");
    }
    atomic.set(input.key, {
      ...existing,
      state: "completed",
      statusCode: input.statusCode,
      body: input.body,
    });
  },

  async fail(input) {
    const existing = atomic.get(input.key);
    if (!existing || existing.fingerprint !== input.fingerprint) {
      throw new Error("Atomic idempotency reservation missing or mismatched");
    }
    atomic.set(input.key, {
      ...existing,
      state: "failed",
      statusCode: input.statusCode,
      body: input.body,
    });
  },

  async read(key) {
    const existing = atomic.get(key);
    if (!existing) return null;
    if (existing.expiresAt.getTime() <= Date.now()) {
      atomic.delete(key);
      return null;
    }
    return existing;
  },
};

export const memoryMutationReceiptPersistence: MutationReceiptPersistence = {
  async read(mutationId) {
    return receipts.get(mutationId) ?? null;
  },
  async create(receipt) {
    if (receipts.has(receipt.mutationId)) return "exists";
    receipts.set(receipt.mutationId, receipt);
    return "created";
  },
  async update(mutationId, patch) {
    const existing = receipts.get(mutationId);
    if (!existing) throw new Error("Mutation receipt not found");
    receipts.set(mutationId, { ...existing, ...patch });
  },
};

export const memoryAuditPersistence: AuditPersistence = {
  async health() {},

  async append(input) {
    console.info(JSON.stringify({
      event: input.event,
      requestId: input.requestId,
      route: input.route,
      status: input.status,
      code: input.code,
      occurredAt: input.occurredAt.toISOString(),
    }));
  },
};

export const memoryMutationLeasePersistence: MutationLeasePersistence = {
  async acquire(input) {
    const now = Date.now();
    const existing = leases.get(input.mutationId);
    if (
      existing
      && existing.state === "active"
      && Date.parse(existing.leaseExpiresAt) > now
      && existing.ownerId !== input.ownerId
    ) {
      return { kind: "busy", lease: existing };
    }

    const lease: MutationLease = {
      mutationId: input.mutationId,
      ownerId: input.ownerId,
      state: "active",
      leaseExpiresAt: input.leaseExpiresAt.toISOString(),
      heartbeatAt: new Date().toISOString(),
      attempt: (existing?.attempt ?? 0) + 1,
    };
    leases.set(input.mutationId, lease);
    return { kind: "acquired", lease };
  },

  async heartbeat(input) {
    const existing = leases.get(input.mutationId);
    if (!existing || existing.ownerId !== input.ownerId || existing.state !== "active") {
      return false;
    }
    leases.set(input.mutationId, {
      ...existing,
      heartbeatAt: new Date().toISOString(),
      leaseExpiresAt: input.leaseExpiresAt.toISOString(),
    });
    return true;
  },

  async complete(input) {
    const existing = leases.get(input.mutationId);
    if (!existing || existing.ownerId !== input.ownerId) return;
    leases.set(input.mutationId, { ...existing, state: "completed" });
  },

  async fail(input) {
    const existing = leases.get(input.mutationId);
    if (!existing || existing.ownerId !== input.ownerId) return;
    leases.set(input.mutationId, { ...existing, state: "failed" });
  },

  async read(mutationId) {
    return leases.get(mutationId) ?? null;
  },
};

export const memorySettlementPersistence: SettlementPersistence = {
  async read(settlementId) {
    return settlements.get(settlementId) ?? null;
  },
  async findByMutationId(mutationId) {
    for (const value of settlements.values()) {
      if (value.mutationId === mutationId) return value;
    }
    return null;
  },
  async create(record) {
    if (settlements.has(record.settlementId)) return "exists";
    settlements.set(record.settlementId, record);
    return "created";
  },
  async transition(input) {
    const existing = settlements.get(input.settlementId);
    if (!existing || existing.state !== input.expectedState) return false;
    settlements.set(input.settlementId, {
      ...existing,
      state: input.nextState,
      transactionSignature: input.transactionSignature ?? existing.transactionSignature,
      submittedAt:
        input.nextState === "submitted"
          ? existing.submittedAt ?? input.updatedAt
          : existing.submittedAt,
      errorCode: input.errorCode ?? existing.errorCode,
      observedAt: input.observedAt ?? existing.observedAt,
      finalizedAt: input.finalizedAt ?? existing.finalizedAt,
      reconciledAt: input.reconciledAt ?? existing.reconciledAt,
      updatedAt: input.updatedAt,
    });
    return true;
  },
};


export const memorySettlementRegistrationPersistence:
  SettlementRegistrationPersistence = {
  async registerSubmitted(
    input,
  ) {
    let existing =
      Array.from(
        settlements.values(),
      ).find(
        value =>
          value.mutationId ===
          input.settlement
            .mutationId,
      );

    if (!existing) {
      existing = {
        ...input.settlement,
        state: "created",
        transactionSignature:
          undefined,
        submittedAt:
          undefined,
      };
      settlements.set(
        existing.settlementId,
        existing,
      );
    }

    if (
      existing
        .transactionSignature &&
      existing
        .transactionSignature !==
        input.signature
    ) {
      throw new Error(
        "Settlement is already bound to a different transaction signature",
      );
    }

    if (
      existing.state ===
      "failed"
    ) {
      throw new Error(
        "Failed settlement cannot be resubmitted automatically",
      );
    }

    const now =
      new Date()
        .toISOString();

    if (
      existing.state ===
        "created" ||
      existing.state ===
        "manual-review"
    ) {
      existing = {
        ...existing,
        state:
          "submitted",
        transactionSignature:
          input.signature,
        submittedAt:
          existing.submittedAt ??
          now,
        errorCode:
          undefined,
        updatedAt: now,
      };
    } else if (
      !existing
        .transactionSignature
    ) {
      existing = {
        ...existing,
        transactionSignature:
          input.signature,
        updatedAt: now,
      };
    }

    settlements.set(
      existing.settlementId,
      existing,
    );

    const existingEvent =
      outbox.get(
        input.event.eventId,
      );

    if (
      !existingEvent ||
      existingEvent.state ===
        "failed"
    ) {
      outbox.set(
        input.event.eventId,
        {
          ...input.event,
          aggregateId:
            existing.settlementId,
          state: "pending",
          ownerId: undefined,
          leaseUntil: undefined,
          lastError: undefined,
          failedAt: undefined,
        },
      );
    }

    return existing;
  },
};

export const memoryOutboxPersistence: OutboxPersistence = {
  async enqueue(event) {
    if (outbox.has(event.eventId)) {
      return "exists";
    }

    outbox.set(
      event.eventId,
      {
        ...event,
        state: "pending",
      },
    );

    return "created";
  },

  async claim(
    limit,
    ownerId,
    leaseUntil,
  ) {
    const now = Date.now();
    const claimed:
      OutboxEvent[] = [];

    for (
      const [key, value]
      of outbox
    ) {
      if (
        claimed.length >=
        limit
      ) {
        break;
      }

      if (
        value.state ===
          "completed" ||
        value.state ===
          "failed"
      ) {
        continue;
      }

      if (
        Date.parse(
          value.availableAt,
        ) > now
      ) {
        continue;
      }

      if (
        value.ownerId &&
        (value.leaseUntil ??
          0) > now &&
        value.ownerId !==
          ownerId
      ) {
        continue;
      }

      const updated:
        MemoryOutbox = {
        ...value,
        ownerId,
        leaseUntil:
          leaseUntil.getTime(),
        state: "processing",
        attempts:
          value.attempts + 1,
      };

      outbox.set(
        key,
        updated,
      );
      claimed.push(
        updated,
      );
    }

    return claimed;
  },

  async complete(
    eventId,
    ownerId,
  ) {
    const existing =
      outbox.get(eventId);

    if (
      !existing ||
      existing.ownerId !==
        ownerId
    ) {
      return;
    }

    outbox.set(
      eventId,
      {
        ...existing,
        state: "completed",
        ownerId: undefined,
        leaseUntil: undefined,
      },
    );
  },

  async retry(
    eventId,
    ownerId,
    availableAt,
    errorCode,
  ) {
    const existing =
      outbox.get(eventId);

    if (
      !existing ||
      existing.ownerId !==
        ownerId
    ) {
      return;
    }

    outbox.set(
      eventId,
      {
        ...existing,
        state: "pending",
        ownerId: undefined,
        leaseUntil: undefined,
        availableAt:
          availableAt.toISOString(),
        lastError:
          errorCode ??
          existing.lastError,
      },
    );
  },

  async fail(
    eventId,
    ownerId,
    errorCode,
  ) {
    const existing =
      outbox.get(eventId);

    if (
      !existing ||
      existing.ownerId !==
        ownerId
    ) {
      return;
    }

    outbox.set(
      eventId,
      {
        ...existing,
        state: "failed",
        ownerId: undefined,
        leaseUntil: undefined,
        lastError:
          errorCode ??
          existing.lastError,
        failedAt:
          new Date().toISOString(),
      },
    );
  },

  async recoverExpiredLeases(
    limit,
    now,
  ) {
    let recovered = 0;

    for (
      const [key, value]
      of outbox
    ) {
      if (
        recovered >= limit
      ) {
        break;
      }

      if (
        value.state !==
          "processing" ||
        !value.leaseUntil ||
        value.leaseUntil >
          now.getTime()
      ) {
        continue;
      }

      outbox.set(
        key,
        {
          ...value,
          state: "pending",
          ownerId: undefined,
          leaseUntil: undefined,
          availableAt:
            new Date(
              Math.min(
                Date.parse(
                  value.availableAt,
                ),
                now.getTime(),
              ),
            ).toISOString(),
        },
      );

      recovered += 1;
    }

    return recovered;
  },

  async stats(now) {
    let pending = 0;
    let processing = 0;
    let completed = 0;
    let failed = 0;
    let expiredLeases = 0;
    let maxAttempts = 0;
    let oldestPending:
      number | null = null;

    for (
      const value
      of outbox.values()
    ) {
      if (
        value.state ===
        "pending"
      ) {
        pending += 1;
      } else if (
        value.state ===
        "processing"
      ) {
        processing += 1;
      } else if (
        value.state ===
        "completed"
      ) {
        completed += 1;
      } else if (
        value.state ===
        "failed"
      ) {
        failed += 1;
      }

      if (
        value.state ===
          "processing" &&
        value.leaseUntil &&
        value.leaseUntil <=
          now.getTime()
      ) {
        expiredLeases += 1;
      }

      maxAttempts =
        Math.max(
          maxAttempts,
          value.attempts,
        );

      if (
        value.state ===
          "pending" ||
        value.state ===
          "processing"
      ) {
        const created =
          Date.parse(
            value.createdAt,
          );

        oldestPending =
          oldestPending === null
            ? created
            : Math.min(
                oldestPending,
                created,
              );
      }
    }

    return {
      pending,
      processing,
      completed,
      failed,
      expiredLeases,
      maxAttempts,
      oldestPendingAt:
        oldestPending === null
          ? undefined
          : new Date(
              oldestPending,
            ).toISOString(),
    };
  },
};
