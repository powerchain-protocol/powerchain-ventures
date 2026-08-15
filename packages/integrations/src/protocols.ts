import {
  CCTP_V2_SOLANA_DOMAIN,
  CCTP_V2_SOLANA_MESSAGE_TRANSMITTER_PROGRAM_ID,
  CCTP_V2_SOLANA_TOKEN_MESSENGER_MINTER_PROGRAM_ID,
} from "./cctp.js";
import {
  ZK_COMPRESSION_STANDARD,
  zkCompressionConfig,
} from "./zk-compression.js";

export function protocolStatus(
  env:
    Record<string, string | undefined> =
      ((globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}),
) {
  const cctpEnabled =
    env
      .POWERCHAIN_CCTP_ENABLED ===
      "1";
  const zk =
    zkCompressionConfig(
      env,
    );

  return {
    solanaPay: {
      enabled:
        env
          .POWERCHAIN_SOLANA_PAY_ENABLED !==
        "0",
      standard:
        "Solana Pay v1.1",
    },
    cctp: {
      enabled:
        cctpEnabled,
      version: "V2",
      solanaDomain:
        CCTP_V2_SOLANA_DOMAIN,
      messageTransmitterProgramId:
        CCTP_V2_SOLANA_MESSAGE_TRANSMITTER_PROGRAM_ID,
      tokenMessengerMinterProgramId:
        CCTP_V2_SOLANA_TOKEN_MESSENGER_MINTER_PROGRAM_ID,
    },
    zkCompression: {
      ...ZK_COMPRESSION_STANDARD,
      enabled:
        zk.enabled,
      rpcConfigured:
        Boolean(
          zk.rpcUrl,
        ),
    },
  };
}
