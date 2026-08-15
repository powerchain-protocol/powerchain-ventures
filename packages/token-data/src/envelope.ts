export interface PublicDataEnvelope<T> {
  readonly schemaVersion: 1;
  readonly source: "powerchain";
  readonly kind: string;
  readonly generatedAt: string;
  readonly data: T;
}

export function createPublicDataEnvelope<T>(
  kind: string,
  data: T,
  generatedAt = "2026-08-15T00:00:00.000Z",
): PublicDataEnvelope<T> {
  return Object.freeze({
    schemaVersion: 1,
    source: "powerchain",
    kind,
    generatedAt,
    data,
  });
}
