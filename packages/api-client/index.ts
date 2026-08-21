import type {
  AuthenticatedAccount,
  ApiEnvelope,
  CampaignDraft,
  CreateLaunchInput,
  CreatedLaunch,
  HeliusAssetPage,
  HeliusTransactionPage,
  HeliusTransferPage,
  LaunchAuthoritySummary,
  LaunchHealthReport,
  LaunchOperationsOverview,
  LaunchReadiness,
  LaunchSummary,
  LaunchTimelineItem,
  LaunchTreasurySummary,
  MarketBatchResult,
  MarketDataSource,
  MarketPriceResult,
  MarketProviderHealth,
  Paginated,
  RealtimeStatus,
  RuntimeFallbackStatus,
  SolanaBalance,
  SolanaRpcStatus,
  TransactionReview
} from "@powerchain/types";

export class PowerChainApiError extends Error {
  constructor(public status: number, public code: string, message: string, public requestId?: string) {
    super(message);
    this.name = "PowerChainApiError";
  }
}

export type PowerChainApiOptions = { baseUrl: string; fetchImpl?: typeof fetch };

type Envelope<T> = ApiEnvelope<T> & { requestId?: string };

export function createPowerChainApi({ baseUrl, fetchImpl = fetch }: PowerChainApiOptions) {
  const root = baseUrl.replace(/\/$/, "");
  async function requestEnvelope<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
    const response = await fetchImpl(`${root}${path}`, {
      credentials: "include",
      ...init,
      headers: { ...(init?.body ? { "content-type": "application/json" } : {}), ...init?.headers }
    });
    const payload = await response.json().catch(() => null) as Envelope<T> | { error?: { code?: string; message?: string }; requestId?: string } | null;
    if (!response.ok) {
      const err = payload && "error" in payload ? payload.error : undefined;
      throw new PowerChainApiError(response.status, err?.code || "request_failed", err?.message || `Request failed with ${response.status}`, payload?.requestId);
    }
    if (!payload || !("data" in payload)) throw new PowerChainApiError(response.status, "invalid_response", "PowerChain API returned an invalid response envelope.");
    return payload as Envelope<T>;
  }
  async function request<T>(path: string, init?: RequestInit): Promise<T> { return (await requestEnvelope<T>(path, init)).data; }
  async function paginated<T>(path: string): Promise<Paginated<T>> {
    const envelope = await requestEnvelope<T[]>(path);
    const meta = envelope.meta ?? {};
    return {
      items: envelope.data,
      page: Number(meta.page ?? 1),
      limit: Number(meta.limit ?? envelope.data.length),
      total: Number(meta.total ?? envelope.data.length)
    };
  }

  return {
    health: () => request<{ ok: boolean; service: string; network: string }>("/api/v1/health"),
    getMe: () => request<AuthenticatedAccount>("/api/v1/account/me"),
    listLaunches: () => request<LaunchSummary[]>("/api/v1/launches"),
    createLaunch: (input: CreateLaunchInput) => request<CreatedLaunch>("/api/v1/launches", { method: "POST", body: JSON.stringify(input) }),
    getLaunch: (id: string) => request<LaunchSummary>(`/api/v1/launches/${encodeURIComponent(id)}`),
    getReadiness: (id: string) => request<LaunchReadiness>(`/api/v1/launches/${encodeURIComponent(id)}/readiness`),
    getLaunchHealth: (id: string) => request<LaunchHealthReport>(`/api/v1/launches/${encodeURIComponent(id)}/health`),
    getLaunchOverview: (id: string) => request<LaunchOperationsOverview>(`/api/v1/launches/${encodeURIComponent(id)}/overview`),
    getLaunchTimeline: (id: string) => request<LaunchTimelineItem[]>(`/api/v1/launches/${encodeURIComponent(id)}/timeline`),
    getLaunchTreasury: (id: string) => request<LaunchTreasurySummary>(`/api/v1/launches/${encodeURIComponent(id)}/treasury`),
    getLaunchAuthorities: (id: string) => request<LaunchAuthoritySummary[]>(`/api/v1/launches/${encodeURIComponent(id)}/authorities`),

    createCampaign: (input: CampaignDraft) => request<CreatedLaunch>("/api/v1/campaigns", { method: "POST", body: JSON.stringify(input) }),
    prepareCampaignLaunch: (id: string, authority: string, simulate = true) => request<TransactionReview>(`/api/v1/campaigns/${encodeURIComponent(id)}/prepare-launch`, { method: "POST", body: JSON.stringify({ authority, simulate }) }),
    confirmCampaignLaunch: (id: string, reviewId: string, signature: string, authority: string) => request<LaunchSummary>(`/api/v1/campaigns/${encodeURIComponent(id)}/confirm-launch`, { method: "POST", body: JSON.stringify({ reviewId, signature, authority }) }),

    getMarketPrice: (symbol = "SOL", refresh = false, options: { source?: MarketDataSource; fallback?: boolean } = {}) => {
      const query = new URLSearchParams({ symbol });
      if (refresh) query.set("refresh", "true");
      if (options.source) query.set("source", options.source);
      if (options.fallback === false) query.set("fallback", "false");
      return request<MarketPriceResult>(`/api/v1/market/price?${query}`);
    },
    getMarketPrices: (symbols: string[], options: { source?: MarketDataSource; fallback?: boolean; refresh?: boolean } = {}) => {
      const query = new URLSearchParams({ symbols: symbols.join(",") });
      if (options.source) query.set("source", options.source);
      if (options.fallback === false) query.set("fallback", "false");
      if (options.refresh) query.set("refresh", "true");
      return request<MarketBatchResult>(`/api/v1/market/prices?${query}`);
    },
    getMarketProviders: () => request<MarketProviderHealth[]>("/api/v1/market/providers"),

    getRuntime: () => request<{ service: string; version: string; environment: string; dataMode: string; cluster: string; websocket: string; launchProgramConfigured: boolean; startedAt: string; uptimeSeconds: number }>("/api/v1/system/runtime"),
    getFallbackStatus: () => request<RuntimeFallbackStatus>("/api/v1/system/fallbacks"),
    getRealtimeStatus: () => request<RealtimeStatus>("/api/v1/system/realtime"),

    listParticipants: (launchId: string, page = 1, limit = 25) => paginated<unknown>(`/api/v1/lifecycle/participants?launchId=${encodeURIComponent(launchId)}&page=${page}&limit=${limit}`),
    listClaims: (launchId: string, page = 1, limit = 25, wallet?: string) => paginated<unknown>(`/api/v1/lifecycle/claims?launchId=${encodeURIComponent(launchId)}&page=${page}&limit=${limit}${wallet ? `&wallet=${encodeURIComponent(wallet)}` : ""}`),
    listSettlements: (launchId: string, page = 1, limit = 25) => paginated<unknown>(`/api/v1/lifecycle/settlements?launchId=${encodeURIComponent(launchId)}&page=${page}&limit=${limit}`),
    listActivity: (launchId: string, page = 1, limit = 25) => paginated<unknown>(`/api/v1/lifecycle/activity?launchId=${encodeURIComponent(launchId)}&page=${page}&limit=${limit}`),

    getSolanaStatus: () => request<SolanaRpcStatus>("/api/v1/solana/status"),
    getSolanaBalance: (address: string) => request<SolanaBalance>(`/api/v1/solana/wallets/${encodeURIComponent(address)}/balance`),
    getWalletAssets: (address: string, page = 1, limit = 100) => request<HeliusAssetPage>(`/api/v1/solana/wallets/${encodeURIComponent(address)}/assets?page=${page}&limit=${limit}`),
    getWalletTransactions: (address: string, options: { limit?: number; full?: boolean; paginationToken?: string } = {}) => {
      const query = new URLSearchParams();
      if (options.limit) query.set("limit", String(options.limit));
      if (options.full) query.set("full", "true");
      if (options.paginationToken) query.set("paginationToken", options.paginationToken);
      const suffix = query.size ? `?${query}` : "";
      return request<HeliusTransactionPage>(`/api/v1/solana/wallets/${encodeURIComponent(address)}/transactions${suffix}`);
    },
    getWalletTransfers: (address: string, options: { limit?: number; paginationToken?: string; direction?: "in" | "out" | "any"; mint?: string; with?: string; solMode?: "merged" | "separate" } = {}) => {
      const query = new URLSearchParams();
      if (options.limit) query.set("limit", String(options.limit));
      if (options.paginationToken) query.set("paginationToken", options.paginationToken);
      if (options.direction && options.direction !== "any") query.set("direction", options.direction);
      if (options.mint) query.set("mint", options.mint);
      if (options.with) query.set("with", options.with);
      if (options.solMode) query.set("solMode", options.solMode);
      const suffix = query.size ? `?${query}` : "";
      return request<HeliusTransferPage>(`/api/v1/solana/wallets/${encodeURIComponent(address)}/transfers${suffix}`);
    }
  };
}
