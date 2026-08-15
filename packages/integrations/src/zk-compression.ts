export const LIGHT_NULLIFIER_PROGRAM_ID =
  "NFLx5WGPrTHHvdRNsidcrNcLxRruMC92E4yv7zhZBoT" as const;

export const ZK_COMPRESSION_STANDARD =
  Object.freeze({
    name:
      "Solana ZK Compression",
    version:
      "v2-compatible",
    compressedTokens:
      true,
    token2022Compatible:
      true,
    nullifierProgram:
      LIGHT_NULLIFIER_PROGRAM_ID,
  } as const);

export type ZkCompressionConfig = {
  enabled: boolean;
  rpcUrl?: string;
};

export function zkCompressionConfig(
  env:
    Record<string, string | undefined> =
      ((globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}),
): ZkCompressionConfig {
  const rpcUrl =
    env
      .ZK_COMPRESSION_RPC_URL
      ?.trim();

  return {
    enabled:
      env
        .POWERCHAIN_ZK_COMPRESSION_ENABLED ===
        "1",
    ...(rpcUrl
      ? {
          rpcUrl,
        }
      : {}),
  };
}

/**
 * ZK Compression is capability-gated. This guard prevents a feature flag
 * from silently implying that proof RPC / program wiring is ready.
 */
export function assertZkCompressionReady(
  config:
    ZkCompressionConfig,
) {
  if (!config.enabled) {
    throw new Error(
      "zk_compression_disabled",
    );
  }

  if (!config.rpcUrl) {
    throw new Error(
      "zk_compression_rpc_not_configured",
    );
  }

  return config;
}
