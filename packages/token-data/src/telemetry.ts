export type PublicDataTelemetryEvent =
  | "public_data_request"
  | "public_data_success"
  | "public_data_fallback"
  | "public_data_validation_failure"
  | "public_data_circuit_open"
  | "public_data_health_failure";

export interface PublicDataTelemetryRecord {
  readonly event: PublicDataTelemetryEvent;
  readonly release: "1.0.0";
  readonly schemaVersion: 1;
  readonly requestId?: string;
  readonly status?: number;
  readonly durationMs?: number;
  readonly source?: "network" | "snapshot";
  readonly errorCode?: string;
  readonly timestamp: string;
}

export function createPublicDataTelemetryRecord(
  event: PublicDataTelemetryEvent,
  fields: Omit<PublicDataTelemetryRecord, "event" | "release" | "schemaVersion" | "timestamp"> = {},
): PublicDataTelemetryRecord {
  return {
    event,
    release: "1.0.0",
    schemaVersion: 1,
    timestamp: new Date().toISOString(),
    ...fields,
  };
}
