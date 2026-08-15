export type TokenDeploymentStatus = "configuration-ready" | "deployed-unverified" | "verified";
export type Token2022ExtensionName =
  | "MetadataPointer"
  | "TokenMetadata"
  | "TransferFeeConfig"
  | "PermanentDelegate"
  | "MintCloseAuthority"
  | "DefaultAccountState"
  | "InterestBearingConfig"
  | "ScaledUiAmountConfig"
  | "PausableConfig";

export interface PwrcTokenData {
  readonly id: "pwrc";
  readonly name: "PowerChain";
  readonly symbol: "PWRC";
  readonly version: "1.0.0";
  readonly chain: "solana";
  readonly cluster: "mainnet-beta";
  readonly tokenStandard: "SPL Token-2022";
  readonly tokenProgramId: string;
  readonly decimals: 9;
  readonly totalSupplyTokens: "18446000000";
  readonly totalSupplyBaseUnits: "18446000000000000000";
  readonly deploymentStatus: TokenDeploymentStatus;
  readonly mintAddress: string | null;
  readonly metadataAddress: string | null;
  readonly enabledExtensions: readonly Token2022ExtensionName[];
  readonly disabledExtensions: readonly Token2022ExtensionName[];
  readonly authorities: {
    readonly mintAuthorityPolicy: "mint-full-supply-once-then-revoke";
    readonly postGenesisMintAuthority: null;
    readonly freezeAuthority: null;
  };
}

export interface PowerChainFeePolicy {
  readonly feeWallet: string;
  readonly purchaseServiceFeeBps: 250;
  readonly purchaseServiceFeePercent: "2.5";
  readonly claimServiceFeeBps: 0;
  readonly walletTransferServiceFeeBps: 0;
  readonly creatorLifecycleServiceFeeBps: 0;
}

export interface PwrcPublicPayload {
  readonly token: PwrcTokenData;
  readonly feePolicy: PowerChainFeePolicy;
  readonly source: "powerchain-token-data";
  readonly schemaVersion: 1;
  readonly updatedAt: string;
}
