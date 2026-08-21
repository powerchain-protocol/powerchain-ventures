export type LaunchStatus = "DRAFT" | "REVIEW" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED" | "CLAIMABLE" | "COMPLETED" | "CANCELLED";
export type HealthState = "HEALTHY" | "WATCH" | "ATTENTION" | "CRITICAL";
export type ReadinessState = "pass" | "attention" | "blocked";

export type CreateLaunchInput = {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  tokenMint?: string;
  treasuryWallet?: string;
  targetAmount?: number;
  settlementAsset?: "USDC" | "SOL";
};

export type CreatedLaunch = {
  id: string;
  slug: string;
  name: string;
  status: LaunchStatus;
  creatorId?: string | null;
};

export type LaunchSummary = {
  id: string;
  slug: string;
  name: string;
  status: LaunchStatus;
  category?: string | null;
  raisedUsd: number;
  targetUsd: number;
  participants: number;
  allocatedTokens: number;
  readiness: number;
  health: HealthState;
};

export type ReadinessCheck = { id: string; label: string; state: ReadinessState; href?: string };
export type LaunchReadiness = { launchId: string; score: number; checks: ReadinessCheck[]; blockingIssues: number };
export type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };
export type ApiErrorEnvelope = { error: { code: string; message: string; issues?: unknown }; requestId?: string };

export type SolanaRpcStatus = {
  cluster: "devnet" | "mainnet-beta" | "testnet";
  provider: string;
  endpoint: string;
  fallbackConfigured: boolean;
  heliusApiConfigured: boolean;
  reachable: boolean;
  lastValidBlockHeight: number;
};

export type HeliusAssetPage = {
  total: number;
  limit: number;
  page: number;
  items: unknown[];
  last_indexed_slot?: number;
};

export type HeliusTransactionPage = {
  data: unknown[];
  paginationToken?: string | null;
};


export type HeliusTransferPage = {
  data: unknown[];
  paginationToken?: string | null;
};


export type SolanaBalance = {
  address: string;
  lamports: number;
  sol: number;
  cluster: "devnet" | "mainnet-beta" | "testnet";
  provider: string;
  endpoint: string;
  fallbackConfigured: boolean;
  heliusApiConfigured: boolean;
};


export type AuthenticatedAccount = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
  session: {
    id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    expiresAt: string | Date;
  };
};

export type MarketDataSource = "pyth" | "birdeye" | "coingecko";
export type MarketDataMode = "fallback" | "direct";
export type MarketAsset = {
  symbol: string;
  mint?: string;
  pythFeedId?: string;
  coingeckoId?: string;
};
export type MarketPrice = {
  symbol: string;
  usd: number;
  source: MarketDataSource;
  confidence?: number | null;
  change24h?: number | null;
  liquidityUsd?: number | null;
  publishTime: string;
  stale: boolean;
};
export type MarketPriceResult = {
  price: MarketPrice;
  attemptedSources: MarketDataSource[];
  fallbackUsed: boolean;
};
export type MarketProviderHealth = {
  source: MarketDataSource;
  configured: boolean;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
};
export type CampaignDraft = Omit<CreateLaunchInput, "tokenMint" | "treasuryWallet" | "targetAmount" | "settlementAsset"> & {
  id?: string;
  tokenMint: string;
  treasuryWallet: string;
  targetAmount: number;
  settlementAsset: "USDC" | "SOL";
  tokenSymbol?: string;
  tokenDecimals?: number;
  phase: {
    name: string;
    price: number;
    allocation: number;
    minContribution?: number;
    maxContribution?: number;
    startsAt?: string;
    endsAt?: string;
  };
};
export type TransactionReview = {
  id: string;
  action: string;
  network: "solana";
  cluster: "devnet" | "mainnet-beta" | "testnet";
  programId: string;
  authority: string;
  launchId: string;
  instructions: Array<{ programId: string; name: string; accounts: string[]; data: string }>;
  serializedTransactionBase64?: string;
  estimatedNetworkFeeLamports?: number;
  simulation: { status: "not-run" | "passed" | "failed"; logs?: string[]; error?: string | null };
  requiresWalletSignature: true;
  expiresAt: string;
};
export type CampaignLifecycleEvent = {
  id: string;
  launchId: string;
  type: string;
  createdAt: string;
  data?: Record<string, unknown>;
};

export type LaunchPhaseSummary = {
  id?: string;
  name?: string;
  price: number;
  allocation: number;
  minContribution?: number | null;
  maxContribution?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status?: string;
};

export type RuntimeFallbackStatus = {
  solana: { primary: string; websocket: string; fallbackConfigured: boolean; fallback?: string; circuit?: SolanaFallbackHealth };
  market: { order: MarketDataSource[]; providers: MarketProviderHealth[] };
  realtime: RealtimeStatus;
};

export type LaunchHealthSignal = {
  key: "participation" | "allocation" | "treasury" | "transactions" | "configuration";
  label: string;
  state: HealthState;
  summary: string;
  detail?: string;
};

export type LaunchHealthReport = {
  launchId: string;
  state: HealthState;
  generatedAt: string;
  signals: LaunchHealthSignal[];
};

export type LaunchAuthoritySummary = {
  type: "TOKEN_MINT" | "TOKEN_FREEZE" | "SALE_CONFIGURATION" | "TREASURY" | "VESTING" | "PROGRAM_UPGRADE";
  address: string | null;
  controlType: string;
  revoked: boolean;
  verifiedAt?: string | null;
};

export type LaunchTreasurySummary = {
  launchId: string;
  settlementAsset: string;
  treasuryWallet: string | null;
  totalRaised: number;
  pendingSettlement: number;
  settled: number;
  reconciled: number;
  failed: number;
};

export type LaunchTimelineItem = {
  id: string;
  kind: "configuration" | "launch" | "phase" | "transaction" | "settlement" | "claim" | "activity";
  title: string;
  status: string;
  at: string | null;
  signature?: string | null;
  metadata?: Record<string, unknown>;
};

export type LaunchOperationsOverview = {
  launch: LaunchSummary;
  readiness: LaunchReadiness;
  health: LaunchHealthReport;
  treasury: LaunchTreasurySummary;
  authorities: LaunchAuthoritySummary[];
  timeline: LaunchTimelineItem[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type MarketBatchResult = {
  prices: MarketPriceResult[];
  unavailable: Array<{ symbol: string; code: string }>;
};

export type RealtimeStatus = {
  path: string;
  clients: number;
  subscriptions: number;
  heartbeatMs: number;
  marketBroadcastMs: number;
  restFallback: string;
};

export type SolanaFallbackHealth = {
  primary: { provider: string; endpoint: string; openUntil: string | null; consecutiveFailures: number };
  fallback: { configured: boolean; endpoint?: string; openUntil: string | null; consecutiveFailures: number };
};
