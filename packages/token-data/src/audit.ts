export type AuditEventType =
  | "request_rejected_origin"
  | "request_rate_limited"
  | "idempotency_replay"
  | "idempotency_conflict"
  | "runtime_config_failure"
  | "public_data_failure";

export interface AuditEvent {
  readonly event: AuditEventType;
  readonly release: "1.0.0";
  readonly requestId?: string;
  readonly route?: string;
  readonly status?: number;
  readonly code?: string;
  readonly occurredAt: string;
}

export function createAuditEvent(
  event: AuditEventType,
  fields: Omit<AuditEvent, "event" | "release" | "occurredAt"> = {},
): AuditEvent {
  return {
    event,
    release: "1.0.0",
    occurredAt: new Date().toISOString(),
    ...fields,
  };
}
