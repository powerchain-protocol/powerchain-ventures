import {
  NextResponse,
} from "next/server";
import {
  protocolStatus,
} from "@powerchain/integrations/protocols";
import {
  CCTP_V2_SOLANA,
  PYTH_SOLANA_PROGRAMS,
  SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID,
  SOLANA_SPL_TOKEN_PROGRAM_ID,
  SOLANA_SYSTEM_PROGRAM_ID,
  SOLANA_TOKEN_2022_PROGRAM_ID,
} from "@powerchain/launchpad-config";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      solana: {
        cluster:
          process.env
            .NEXT_PUBLIC_SOLANA_CLUSTER ===
          "devnet"
            ? "devnet"
            : "mainnet-beta",
        programs: {
          system:
            SOLANA_SYSTEM_PROGRAM_ID,
          splToken:
            SOLANA_SPL_TOKEN_PROGRAM_ID,
          token2022:
            SOLANA_TOKEN_2022_PROGRAM_ID,
          associatedToken:
            SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID,
          powerchainLaunchpad:
            process.env
              .POWERCHAIN_LAUNCHPAD_PROGRAM_ID
              ?.trim() ||
            null,
        },
        launchpadDeploymentStatus:
          process.env
            .POWERCHAIN_LAUNCHPAD_PROGRAM_ID
            ?.trim()
            ? "configured"
            : "configuration-ready",
      },
      pyth: {
        recommendedGeneration:
          "upgraded",
        upgradeDate:
          PYTH_SOLANA_PROGRAMS
            .upgradeDate,
        current:
          PYTH_SOLANA_PROGRAMS
            .current,
        upgraded:
          PYTH_SOLANA_PROGRAMS
            .upgraded,
      },
      cctp: {
        ...CCTP_V2_SOLANA,
      },
      protocols:
        protocolStatus(),
    },
    {
      headers: {
        "cache-control":
          "public, max-age=60, s-maxage=300",
        "x-powerchain-release":
          "1.0.0",
      },
    },
  );
}
