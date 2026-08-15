import {
  Buffer,
} from "node:buffer";
import {
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  buildClaimOperation,
  buildSaleActivationOperations,
  buildLifecycleOperation,
  buildPauseOperation,
  buildTimingOperation,
  operationToReview,
  type ProgramOperation,
} from "@powerchain/launchpad-program-client";
import {
  solanaRpc,
} from "./solana-rpc";
import type {
  BuilderPlan,
} from "./transaction-builder";

type AccountInfoResult = {
  value:
    | null
    | {
        owner: string;
      };
};

function cluster():
  | "devnet"
  | "mainnet-beta" {
  return process.env
    .NEXT_PUBLIC_SOLANA_CLUSTER ===
    "devnet"
    ? "devnet"
    : "mainnet-beta";
}

async function accountExists(
  address: string,
) {
  const response =
    await solanaRpc<AccountInfoResult>(
      "getAccountInfo",
      [
        address,
        {
          encoding: "base64",
          commitment: "confirmed",
        },
      ],
    );

  return response.result.value !== null;
}

async function latestBlockhash() {
  const response =
    await solanaRpc<{
      blockhash: string;
      lastValidBlockHeight: number;
    }>(
      "getLatestBlockhash",
      [
        {
          commitment: "confirmed",
        },
      ],
    );

  return response.result;
}

async function networkFee(
  transaction:
    Transaction,
) {
  const message =
    Buffer.from(
      transaction
        .compileMessage()
        .serialize(),
    ).toString("base64");

  const response =
    await solanaRpc<{
      value:
        number | null;
    }>(
      "getFeeForMessage",
      [
        message,
        {
          commitment:
            "confirmed",
        },
      ],
    );

  return BigInt(
    response.result.value ??
      5_000,
  );
}

async function tokenAccountRent() {
  const response =
    await solanaRpc<number>(
      "getMinimumBalanceForRentExemption",
      [165],
    );

  return BigInt(
    response.result,
  );
}

async function simulate(
  serializedBase64: string,
) {
  const response =
    await solanaRpc<{
      value: {
        err: unknown;
        unitsConsumed?:
          number;
        logs?:
          string[] | null;
      };
    }>(
      "simulateTransaction",
      [
        serializedBase64,
        {
          encoding: "base64",
          sigVerify: false,
          commitment:
            "processed",
        },
      ],
    );

  return {
    ok:
      response.result.value
        .err == null,
    unitsConsumed:
      response.result.value
        .unitsConsumed,
    error:
      response.result.value
        .err
        ? JSON.stringify(
            response.result.value
              .err,
          )
        : undefined,
  };
}

function genericInstructionReview(
  instruction:
    TransactionInstruction,
  index: number,
  input: {
    programName: string;
    summary: string;
    labels?:
      readonly string[];
  },
) {
  return {
    index,
    programId:
      instruction.programId
        .toBase58(),
    programName:
      input.programName,
    accounts:
      instruction.keys.map(
        (
          key,
          accountIndex,
        ) => ({
          address:
            key.pubkey
              .toBase58(),
          signer:
            key.isSigner,
          writable:
            key.isWritable,
          label:
            input.labels?.[
              accountIndex
            ] ??
            `Account ${
              accountIndex + 1
            }`,
        }),
      ),
    dataBase64:
      Buffer.from(
        instruction.data,
      ).toString("base64"),
    summary:
      input.summary,
  };
}

async function buildPlan(input: {
  feePayer: string;
  operation:
    ProgramOperation;
  additionalOperations?:
    ProgramOperation[];
  before?: Array<{
    instruction:
      TransactionInstruction;
    programName: string;
    summary: string;
    labels?:
      readonly string[];
  }>;
  recipients?: BuilderPlan["recipients"];
  rentLamports?: bigint;
}): Promise<BuilderPlan> {
  const payer =
    new PublicKey(
      input.feePayer,
    );

  const latest =
    await latestBlockhash();

  const transaction =
    new Transaction({
      feePayer: payer,
      recentBlockhash:
        latest.blockhash,
    });

  for (
    const item
    of input.before ?? []
  ) {
    transaction.add(
      item.instruction,
    );
  }

  transaction.add(
    input.operation
      .instruction,
  );

  for (
    const operation
    of input.additionalOperations ??
      []
  ) {
    transaction.add(
      operation.instruction,
    );
  }

  const fee =
    await networkFee(
      transaction,
    );

  const serialized =
    Buffer.from(
      transaction.serialize({
        requireAllSignatures:
          false,
        verifySignatures:
          false,
      }),
    ).toString("base64");

  const simulation =
    await simulate(
      serialized,
    );

  if (!simulation.ok) {
    throw new Error(
      `program_transaction_simulation_failed:${
        simulation.error ??
        "unknown"
      }`,
    );
  }

  const instructions:
    BuilderPlan["instructions"] =
    [];

  for (
    const [
      index,
      item,
    ]
    of (
      input.before ?? []
    ).entries()
  ) {
    instructions.push(
      genericInstructionReview(
        item.instruction,
        index,
        item,
      ),
    );
  }

  instructions.push(
    operationToReview(
      input.operation,
      instructions.length,
    ),
  );

  for (
    const operation
    of input.additionalOperations ??
      []
  ) {
    instructions.push(
      operationToReview(
        operation,
        instructions.length,
      ),
    );
  }

  const instructionDataBase64 =
    Buffer.from(
      input.operation
        .instruction.data,
    ).toString("base64");

  const rentLamports =
    input.rentLamports ??
    0n;

  return {
    id:
      crypto.randomUUID(),
    cluster:
      cluster(),
    feePayer:
      input.feePayer,
    recentBlockhash:
      latest.blockhash,
    programOperation: {
      programId:
        input.operation
          .instruction
          .programId
          .toBase58(),
      operation:
        input.operation.name,
      salePda:
        input.operation
          .salePda!,
      participantPda:
        input.operation
          .participantPda,
      instructionDataBase64,
    },
    instructions,
    fees: {
      networkFeeLamports:
        fee.toString(),
      serviceFeeLamports:
        "0",
      rentLamports:
        rentLamports.toString(),
      totalLamports:
        (
          fee +
          rentLamports
        ).toString(),
    },
    recipients:
      input.recipients ??
      [],
    serializedTransactionBase64:
      serialized,
    expiresAt:
      new Date(
        Date.now() +
          90_000,
      ).toISOString(),
    simulation: {
      ok: true,
      unitsConsumed:
        simulation.unitsConsumed,
    },
  };
}

export async function buildLocalSaleActivationTransaction(
  input: {
    programId: string;
    saleId: string;
    creatorWallet: string;
    mint: string;
    sourceVaultTokenAccount: string;
    sourceVaultAuthority: string;
    paymentReceiverWallet: string;
    decimals: number;
    eligibility:
      | "public"
      | "allowlist"
      | "trusted";
    vestingEnabled: boolean;
    deliveryMode:
      | "immediate"
      | "claim";
    quoteAuthorityWallet: string;
    startsAt: string;
    endsAt: string;
    claimStartsAt: string;
    vestingCliffAt: string;
    vestingEndsAt: string;
    allocationBaseUnits: string;
    priceUsdMicros: string;
    minPurchaseUsdMicros: string;
    maxPurchaseUsdMicros: string;
  },
): Promise<BuilderPlan> {
  if (
    input.sourceVaultAuthority !==
    input.creatorWallet
  ) {
    throw new Error(
      "local_sale_activation_requires_creator_vault_authority",
    );
  }

  const operations =
    buildSaleActivationOperations(
      {
        programId:
          input.programId,
        saleId:
          input.saleId,
        creatorWallet:
          input.creatorWallet,
        mint:
          input.mint,
        sourceVaultTokenAccount:
          input.sourceVaultTokenAccount,
        sourceVaultAuthority:
          input.sourceVaultAuthority,
        paymentReceiverWallet:
          input.paymentReceiverWallet,
        decimals:
          input.decimals,
        eligibility:
          input.eligibility,
        vestingEnabled:
          input.vestingEnabled,
        deliveryMode:
          input.deliveryMode,
        quoteAuthorityWallet:
          input.quoteAuthorityWallet,
        startsAt:
          input.startsAt,
        endsAt:
          input.endsAt,
        claimStartsAt:
          input.claimStartsAt,
        vestingCliffAt:
          input.vestingCliffAt,
        vestingEndsAt:
          input.vestingEndsAt,
        allocationBaseUnits:
          input.allocationBaseUnits,
        priceUsdMicros:
          input.priceUsdMicros,
        minPurchaseUsdMicros:
          input.minPurchaseUsdMicros,
        maxPurchaseUsdMicros:
          input.maxPurchaseUsdMicros,
      },
    );

  const primary =
    operations[0];
  const adopt =
    operations[1];

  if (
    !primary ||
    !adopt
  ) {
    throw new Error(
      "sale_activation_operations_incomplete",
    );
  }

  return buildPlan({
    feePayer:
      input.creatorWallet,
    operation:
      primary,
    additionalOperations: [
      adopt,
    ],
  });
}

export async function buildLocalClaimTransaction(
  input: {
    wallet: string;
    programId: string;
    salePda: string;
    sourceVaultTokenAccount: string;
    mint: string;
    amountBaseUnits: string;
  },
): Promise<BuilderPlan> {
  const mint =
    new PublicKey(
      input.mint,
    );
  const wallet =
    new PublicKey(
      input.wallet,
    );

  const destination =
    getAssociatedTokenAddressSync(
      mint,
      wallet,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

  const exists =
    await accountExists(
      destination.toBase58(),
    );

  const before:
    Array<{
      instruction:
        TransactionInstruction;
      programName: string;
      summary: string;
      labels?:
        readonly string[];
    }> = [];

  let rentLamports = 0n;

  if (!exists) {
    before.push({
      instruction:
        createAssociatedTokenAccountIdempotentInstruction(
          wallet,
          destination,
          wallet,
          mint,
          TOKEN_2022_PROGRAM_ID,
        ),
      programName:
        "Associated Token Program",
      summary:
        "Create the participant Token-2022 associated token account if it does not already exist.",
      labels: [
        "Fee payer",
        "Destination token account",
        "Wallet owner",
        "Token mint",
        "System program",
        "Token program",
      ],
    });

    rentLamports =
      await tokenAccountRent();
  }

  const operation =
    buildClaimOperation({
      programId:
        input.programId,
      salePda:
        input.salePda,
      wallet:
        input.wallet,
      sourceVaultTokenAccount:
        input.sourceVaultTokenAccount,
      destinationTokenAccount:
        destination.toBase58(),
      mint:
        input.mint,
      amountBaseUnits:
        input.amountBaseUnits,
    });

  return buildPlan({
    feePayer:
      input.wallet,
    operation,
    before,
    rentLamports,
    recipients: [
      {
        address:
          destination.toBase58(),
        label:
          "Claim destination Token-2022 account",
        amountBaseUnits:
          input.amountBaseUnits,
        mint:
          input.mint,
      },
    ],
  });
}

export async function buildLocalCreatorTransaction(
  input:
    | {
        action:
          | "pause"
          | "resume";
        wallet: string;
        programId:
          string;
        salePda:
          string;
      }
    | {
        action:
          | "cancel"
          | "complete";
        wallet: string;
        programId:
          string;
        salePda:
          string;
      }
    | {
        action:
          "update-timing";
        wallet: string;
        programId:
          string;
        salePda:
          string;
        startsAt:
          string;
        endsAt:
          string;
        claimStartsAt:
          string;
        vestingCliffAt:
          string;
        vestingEndsAt:
          string;
      },
): Promise<BuilderPlan> {
  let operation:
    ProgramOperation;

  if (
    input.action ===
      "pause" ||
    input.action ===
      "resume"
  ) {
    operation =
      buildPauseOperation({
        programId:
          input.programId,
        salePda:
          input.salePda,
        creatorWallet:
          input.wallet,
        paused:
          input.action ===
          "pause",
      });
  } else if (
    input.action ===
      "update-timing"
  ) {
    operation =
      buildTimingOperation({
        programId:
          input.programId,
        salePda:
          input.salePda,
        creatorWallet:
          input.wallet,
        startsAt:
          input.startsAt,
        endsAt:
          input.endsAt,
        claimStartsAt:
          input.claimStartsAt,
        vestingCliffAt:
          input.vestingCliffAt,
        vestingEndsAt:
          input.vestingEndsAt,
      });
  } else {
    operation =
      buildLifecycleOperation({
        programId:
          input.programId,
        salePda:
          input.salePda,
        creatorWallet:
          input.wallet,
        action:
          input.action,
      });
  }

  return buildPlan({
    feePayer:
      input.wallet,
    operation,
  });
}
