export const POWERCHAIN_SECURITY_POLICY = Object.freeze({
  release: "1.0.0",
  publicApi: Object.freeze({
    cors: "same-origin",
    credentials: false,
    methods: Object.freeze(["GET", "HEAD", "OPTIONS"]),
  }),
  headers: Object.freeze({
    contentTypeOptions: "nosniff",
    referrerPolicy: "strict-origin-when-cross-origin",
    frameOptions: "DENY",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=()",
  }),
  rateLimits: Object.freeze({
    publicMetadataPerMinute: 120,
    publicHealthPerMinute: 60,
    authenticatedMutationPerMinute: 30,
  }),
});

export type PowerChainSecurityPolicy = typeof POWERCHAIN_SECURITY_POLICY;
