export interface RateLimitPersistence {
  consume(input: {
    bucket: string;
    identityHash: string;
    limit: number;
    windowSeconds: number;
    now: Date;
  }): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  }>;
}

export interface IdempotencyPersistence {
  read(key: string): Promise<{
    fingerprint: string;
    statusCode: number;
    body: unknown;
    expiresAt: Date;
  } | null>;

  create(input: {
    key: string;
    fingerprint: string;
    statusCode: number;
    body: unknown;
    expiresAt: Date;
  }): Promise<"created" | "exists">;
}

export interface AuditPersistence {
  append(input: {
    event: string;
    requestId?: string;
    route?: string;
    status?: number;
    code?: string;
    metadata?: Record<string, unknown>;
    occurredAt: Date;
  }): Promise<void>;
}
