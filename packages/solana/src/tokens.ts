import {
  PublicKey,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export type SolanaTokenProgram =
  | "spl-token"
  | "token-2022";

export function tokenProgramId(
  program:
    SolanaTokenProgram,
) {
  return program ===
    "token-2022"
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;
}

export function associatedTokenAddress(
  input: {
    owner: string;
    mint: string;
    program:
      SolanaTokenProgram;
    allowOwnerOffCurve?: boolean;
  },
) {
  return getAssociatedTokenAddressSync(
    new PublicKey(
      input.mint,
    ),
    new PublicKey(
      input.owner,
    ),
    input.allowOwnerOffCurve ??
      false,
    tokenProgramId(
      input.program,
    ),
    ASSOCIATED_TOKEN_PROGRAM_ID,
  ).toBase58();
}

export function assertSolanaAddress(
  value: string,
) {
  try {
    return new PublicKey(
      value,
    ).toBase58();
  } catch {
    throw new Error(
      "invalid_solana_address",
    );
  }
}
