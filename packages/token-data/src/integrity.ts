export interface PublicDataIntegrity {
  readonly algorithm: "sha256";
  readonly canonicalJsonSha256: string;
  readonly schemaVersion: 1;
}

export function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`);
  return `{${entries.join(",")}}`;
}

export function hasSupportedPublicDataSchema(value: unknown): value is {
  schemaVersion: 1;
  source: "powerchain";
} {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { schemaVersion?: unknown; source?: unknown };
  return candidate.schemaVersion === 1 && candidate.source === "powerchain";
}
