export type ApiData<T> = {
  data: T;
  observedAt?: string;
};

export type SolanaProtocolData = {
  cluster:
    | "devnet"
    | "mainnet-beta";
  programs: {
    system: string;
    splToken: string;
    token2022: string;
    associatedToken: string;
  };
};
