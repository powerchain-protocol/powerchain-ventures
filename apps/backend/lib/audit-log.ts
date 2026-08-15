import { createAuditEvent, type AuditEventType } from "@powerchain/token-data";
import { getRuntimePersistence } from "./runtime-persistence";

export async function writeAuditEvent(
  event: AuditEventType,
  fields: {
    requestId?: string;
    route?: string;
    status?: number;
    code?: string;
    metadata?: Record<string, unknown>;
  } = {},
): Promise<void> {
  const record = createAuditEvent(event, fields);
  await getRuntimePersistence().audit.append({
    event: record.event,
    requestId: record.requestId,
    route: record.route,
    status: record.status,
    code: record.code,
    metadata: fields.metadata,
    occurredAt: new Date(record.occurredAt),
  });
}
