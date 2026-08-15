export const POWERCHAIN_PUBLIC_API = Object.freeze({
  release: "1.0.0",
  schemaVersion: 1,
  basePath: "/api/v1",
  endpoints: Object.freeze({
    token: "/api/v1/token",
    publicData: "/api/v1/public-data",
    publicDataHealth: "/api/v1/public-data/health",
    publicDataMeta: "/api/v1/public-data/meta",
    publicDataIntegrity: "/api/v1/public-data/integrity",
    version: "/api/v1/version",
  }),
});

export type PowerChainPublicApi = typeof POWERCHAIN_PUBLIC_API;
