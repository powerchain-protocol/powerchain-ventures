export interface PublicDataProvenance {
  readonly release: "1.0.0";
  readonly schemaVersion: 1;
  readonly source: "powerchain-token-data";
  readonly generatedAt: string;
  readonly integrityAlgorithm: "sha256";
}

export const POWERCHAIN_PUBLIC_DATA_PROVENANCE: PublicDataProvenance = Object.freeze({
  release: "1.0.0",
  schemaVersion: 1,
  source: "powerchain-token-data",
  generatedAt: "2026-08-15T00:00:00.000Z",
  integrityAlgorithm: "sha256",
});
