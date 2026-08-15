export type WalletAssetData = {
  wallet: string;
  cluster:
    | "devnet"
    | "mainnet-beta";

  sol: {
    lamports: string;
    uiAmount: number;
    priceUsd: number | null;
    valueUsd: number | null;
  };

  pwrc: {
    mint: string | null;
    tokenAccount: string | null;
    amountBaseUnits: string;
    decimals: number;
    uiAmount: string;
    configured: boolean;
    priceUsd: number | null;
    valueUsd: number | null;
  };

  usdc: {
    mint: string;
    tokenAccount: string;
    amountBaseUnits: string;
    decimals: number;
    uiAmount: string;
    configured: boolean;
    priceUsd: number;
    valueUsd: number;
  };

  conversion: {
    available: boolean;
    pwrcPerSol: number | null;
    solPerPwrc: number | null;
    provider: string;
    observedAt: string;
  } | null;

  rpc: {
    endpoint: string;
    latencyMs: number;
  };

  links: {
    transactions: string;
    transferPrepare: string;
    transferConfirm: string;
  };
};
