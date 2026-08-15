export const API_V1_PREFIX = "/api/v1" as const;

export const API_ENDPOINTS = Object.freeze({
  health: `${API_V1_PREFIX}/health`,
  ready: `${API_V1_PREFIX}/ready`,
  readiness: `${API_V1_PREFIX}/readiness`,
  version: `${API_V1_PREFIX}/version`,
  capabilities: `${API_V1_PREFIX}/capabilities`,
  endpoints: `${API_V1_PREFIX}/endpoints`,
  transportStatus: `${API_V1_PREFIX}/transport/status`,
  cors: `${API_V1_PREFIX}/cors`,
  openapi: `${API_V1_PREFIX}/openapi`,
  swagger: `${API_V1_PREFIX}/swagger`,

  auth: {
    config: `${API_V1_PREFIX}/auth/config`,
    session: `${API_V1_PREFIX}/auth/session`,
    signIn: `${API_V1_PREFIX}/auth/sign-in`,
    signUp: `${API_V1_PREFIX}/auth/sign-up`,
    signOut: `${API_V1_PREFIX}/auth/sign-out`,
    forgotPassword: `${API_V1_PREFIX}/auth/forgot-password`,
    updatePassword: `${API_V1_PREFIX}/auth/update-password`,
    providers: `${API_V1_PREFIX}/auth/providers`,
    walletChallenge: `${API_V1_PREFIX}/auth/wallet/challenge`,
    walletVerify: `${API_V1_PREFIX}/auth/wallet/verify`,
    walletSignOut: `${API_V1_PREFIX}/auth/wallet/sign-out`,
  },

  launchpad: {
    catalog: `${API_V1_PREFIX}/launchpad/catalog`,
    config: `${API_V1_PREFIX}/launchpad/config`,
    network: `${API_V1_PREFIX}/launchpad/network`,
    fees: `${API_V1_PREFIX}/launchpad/fees`,
    quote: `${API_V1_PREFIX}/launchpad/quote`,
    sales: `${API_V1_PREFIX}/launchpad/sales`,
    transactions: `${API_V1_PREFIX}/launchpad/transactions`,
    claim: `${API_V1_PREFIX}/launchpad/claim`,
    eligibility: `${API_V1_PREFIX}/launchpad/eligibility`,
  },

  publicData: {
    root: `${API_V1_PREFIX}/public-data`,
    health: `${API_V1_PREFIX}/public-data/health`,
    integrity: `${API_V1_PREFIX}/public-data/integrity`,
    meta: `${API_V1_PREFIX}/public-data/meta`,
  },

  solana: {
    rpc: `${API_V1_PREFIX}/solana/rpc`,
    websocketStatus: `${API_V1_PREFIX}/solana/ws/status`,
  },

  account: {
    root: `${API_V1_PREFIX}/account`,
    wallets: `${API_V1_PREFIX}/account/wallets`,
  },

  checkout: `${API_V1_PREFIX}/checkout`,

  market: {
    prices: `${API_V1_PREFIX}/market/prices`,
    rates: `${API_V1_PREFIX}/market/rates`,
  },

  purchase: {
    prepare: `${API_V1_PREFIX}/launchpad/purchase/prepare`,
    confirm: `${API_V1_PREFIX}/launchpad/purchase/confirm`,
  },

  settlements: {
    byId: (settlementId: string) =>
      `${API_V1_PREFIX}/settlements/${encodeURIComponent(settlementId)}`,
    reconcile: `${API_V1_PREFIX}/runtime/settlements/reconcile`,
    runtimePersistenceHealth: `${API_V1_PREFIX}/runtime/persistence/health`,
  },

  contact: `${API_V1_PREFIX}/contact`,
  mailStatus: `${API_V1_PREFIX}/mail/status`,
  onrampStatus: `${API_V1_PREFIX}/onramp/status`,
  onrampSession: `${API_V1_PREFIX}/onramp/session`,
  onrampTransactions: `${API_V1_PREFIX}/onramp/transactions`,
} as const);

export function mutationEndpoint(mutationId: string): string {
  return `${API_V1_PREFIX}/mutations/${encodeURIComponent(mutationId)}`;
}

export function settlementEndpoint(settlementId: string): string {
  return `${API_V1_PREFIX}/settlements/${encodeURIComponent(settlementId)}`;
}

export function tokenMarketEndpoint(mint: string): string {
  return `${API_V1_PREFIX}/tokens/${encodeURIComponent(mint)}/market`;
}

export function walletEndpoint(wallet: string): string {
  return `${API_V1_PREFIX}/wallets/${encodeURIComponent(wallet)}`;
}
