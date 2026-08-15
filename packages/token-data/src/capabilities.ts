export interface PowerChainCapabilities {
  readonly release: "1.0.0";
  readonly schemaVersion: 1;
  readonly network: "solana-mainnet-beta";
  readonly tokenStandard: "SPL Token-2022";
  readonly publicData: true;
  readonly tokenData: true;
  readonly walletParticipation: true;
  readonly claims: true;
  readonly creatorConsole: true;
  readonly mobileCompanion: true;
  readonly nativeSigning: false;
}

export const POWERCHAIN_CAPABILITIES: PowerChainCapabilities = Object.freeze({
  release: "1.0.0",
  schemaVersion: 1,
  network: "solana-mainnet-beta",
  tokenStandard: "SPL Token-2022",
  publicData: true,
  tokenData: true,
  walletParticipation: true,
  claims: true,
  creatorConsole: true,
  mobileCompanion: true,
  nativeSigning: false,
});
