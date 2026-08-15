import {
  createPublicDataTelemetryRecord,
  type PublicDataTelemetryEvent,
} from "@powerchain/token-data";

const FORBIDDEN_KEYS = [
  "authorization",
  "cookie",
  "set-cookie",
  "api-key",
  "apikey",
  "secret",
  "token",
  "password",
];

function sanitize(value: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.some(forbidden => key.toLowerCase().includes(forbidden))) continue;
    if (typeof item === "string" && item.length > 512) out[key] = `${item.slice(0, 509)}...`;
    else out[key] = item;
  }
  return out;
}

export function logPublicDataEvent(
  event: PublicDataTelemetryEvent,
  fields: Record<string, unknown> = {},
): void {
  const record = createPublicDataTelemetryRecord(event, sanitize(fields));
  console.info(JSON.stringify(record));
}
