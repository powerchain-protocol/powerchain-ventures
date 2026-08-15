import {
  Buffer,
} from "node:buffer";
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  POWERCHAIN_PWRC_DECIMALS,
  USDC_DECIMALS,
} from "@powerchain/launchpad-config";
import {
  solanaRpc,
} from "./solana-rpc";
import {
  configuredPwrcMint,
  configuredUsdcMint,
} from "./wallet-assets";
import type {
  BuilderPlan,
} from "./transaction-builder";

export type TransferAsset =
  | "SOL"
  | "PWRC"
  | "USDC";

export type WalletTransferContract = {
  asset: TransferAsset;
  wallet: string;
  recipient: string;
  amountBaseUnits: string;
  mint?: string;
  sourceTokenAccount?: string;
  destinationTokenAccount?: string;
  tokenProgram?: string;
  decimals: number;
};

const ADDRESS =
  /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function ixAccounts(
  keys: Array<{
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }>,
  labels: string[],
) {
  return keys.map(
    (key, index) => ({
      address:
        key.pubkey.toBase58(),
      signer: key.isSigner,
      writable: key.isWritable,
      label:
        labels[index] ??
        `Account ${index + 1}`,
    }),
  );
}

async function accountExists(
  address: string,
) {
  const { result } =
    await solanaRpc<{
      value: unknown | null;
    }>(
      "getAccountInfo",
      [
        address,
        {
          encoding: "base64",
          commitment: "confirmed",
        },
      ],
    );

  return result.value !== null;
}

async function feeFor(
  tx: Transaction,
) {
  const message =
    Buffer.from(
      tx.compileMessage().serialize(),
    ).toString("base64");

  const { result } =
    await solanaRpc<{
      value: number | null;
    }>(
      "getFeeForMessage",
      [
        message,
        {
          commitment: "confirmed",
        },
      ],
    );

  return BigInt(
    result.value ?? 5_000,
  );
}

async function simulate(
  serialized: string,
) {
  try {
    const { result } =
      await solanaRpc<{
        value: {
          err: unknown;
          unitsConsumed?: number;
        };
      }>(
        "simulateTransaction",
        [
          serialized,
          {
            encoding: "base64",
            sigVerify: false,
            commitment: "processed",
          },
        ],
      );

    return {
      ok:
        result.value.err == null,
      unitsConsumed:
        result.value.unitsConsumed,
      error:
        result.value.err
          ? JSON.stringify(
              result.value.err,
            )
          : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "simulation_failed",
    };
  }
}

function tokenDefinition(
  asset: Exclude<
    TransferAsset,
    "SOL"
  >,
) {
  if (asset === "PWRC") {
    const mint =
      configuredPwrcMint();

    if (!mint) {
      throw new Error(
        "pwrc_mint_not_configured",
      );
    }

    return {
      mint,
      decimals:
        POWERCHAIN_PWRC_DECIMALS,
      program:
        TOKEN_2022_PROGRAM_ID,
      label: "PWRC",
    };
  }

  return {
    mint:
      configuredUsdcMint(),
    decimals: USDC_DECIMALS,
    program: TOKEN_PROGRAM_ID,
    label: "USDC",
  };
}

export async function buildWalletTransferPlan(
  input: {
    asset: TransferAsset;
    wallet: string;
    recipient: string;
    amountBaseUnits: string;
  },
): Promise<{
  plan: BuilderPlan;
  contract: WalletTransferContract;
}> {
  if (
    !ADDRESS.test(input.wallet) ||
    !ADDRESS.test(input.recipient) ||
    input.wallet === input.recipient
  ) {
    throw new Error(
      "invalid_transfer_wallet",
    );
  }

  if (
    !/^\d+$/.test(
      input.amountBaseUnits,
    ) ||
    BigInt(
      input.amountBaseUnits,
    ) <= 0n
  ) {
    throw new Error(
      "invalid_transfer_amount",
    );
  }

  const { result: block } =
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

  const owner =
    new PublicKey(
      input.wallet,
    );
  const recipientOwner =
    new PublicKey(
      input.recipient,
    );

  const tx =
    new Transaction({
      feePayer: owner,
      recentBlockhash:
        block.blockhash,
    });

  const recipients:
    BuilderPlan["recipients"] = [];

  let rentLamports = 0n;
  let contract:
    WalletTransferContract;

  if (input.asset === "SOL") {
    const amount =
      BigInt(
        input.amountBaseUnits,
      );

    if (
      amount >
      BigInt(
        Number.MAX_SAFE_INTEGER,
      )
    ) {
      throw new Error(
        "transfer_amount_too_large",
      );
    }

    tx.add(
      SystemProgram.transfer({
        fromPubkey: owner,
        toPubkey:
          recipientOwner,
        lamports:
          Number(amount),
      }),
    );

    recipients.push({
      address:
        input.recipient,
      label:
        "SOL recipient",
      amountBaseUnits:
        input.amountBaseUnits,
    });

    contract = {
      asset: "SOL",
      wallet:
        input.wallet,
      recipient:
        input.recipient,
      amountBaseUnits:
        input.amountBaseUnits,
      decimals: 9,
    };
  } else {
    const token =
      tokenDefinition(
        input.asset,
      );

    const mint =
      new PublicKey(
        token.mint,
      );

    const source =
      getAssociatedTokenAddressSync(
        mint,
        owner,
        false,
        token.program,
      );

    const destination =
      getAssociatedTokenAddressSync(
        mint,
        recipientOwner,
        false,
        token.program,
      );

    if (
      !(await accountExists(
        source.toBase58(),
      ))
    ) {
      throw new Error(
        `${token.label.toLowerCase()}_token_account_not_found`,
      );
    }

    const sourceBalance =
      await solanaRpc<{
        value: {
          amount: string;
          decimals: number;
        };
      }>(
        "getTokenAccountBalance",
        [
          source.toBase58(),
          {
            commitment:
              "confirmed",
          },
        ],
      );

    const decimals =
      sourceBalance.result.value
        .decimals;

    if (
      decimals !==
      token.decimals
    ) {
      throw new Error(
        `${token.label.toLowerCase()}_decimals_mismatch`,
      );
    }

    if (
      BigInt(
        sourceBalance
          .result.value.amount,
      ) <
      BigInt(
        input.amountBaseUnits,
      )
    ) {
      throw new Error(
        `insufficient_${token.label.toLowerCase()}_balance`,
      );
    }

    if (
      !(await accountExists(
        destination.toBase58(),
      ))
    ) {
      tx.add(
        createAssociatedTokenAccountIdempotentInstruction(
          owner,
          destination,
          recipientOwner,
          mint,
          token.program,
        ),
      );

      const { result: rent } =
        await solanaRpc<number>(
          "getMinimumBalanceForRentExemption",
          [165],
        );

      rentLamports =
        BigInt(rent);
    }

    tx.add(
      createTransferCheckedInstruction(
        source,
        mint,
        destination,
        owner,
        BigInt(
          input.amountBaseUnits,
        ),
        decimals,
        [],
        token.program,
      ),
    );

    recipients.push({
      address:
        destination.toBase58(),
      label:
        `${token.label} recipient token account`,
      amountBaseUnits:
        input.amountBaseUnits,
      mint:
        token.mint,
    });

    contract = {
      asset:
        input.asset,
      wallet:
        input.wallet,
      recipient:
        input.recipient,
      amountBaseUnits:
        input.amountBaseUnits,
      mint:
        token.mint,
      sourceTokenAccount:
        source.toBase58(),
      destinationTokenAccount:
        destination.toBase58(),
      tokenProgram:
        token.program.toBase58(),
      decimals,
    };
  }

  const networkFee =
    await feeFor(tx);

  if (
    input.asset === "SOL"
  ) {
    const balance =
      await solanaRpc<number>(
        "getBalance",
        [
          input.wallet,
          {
            commitment:
              "confirmed",
          },
        ],
      );

    if (
      BigInt(balance.result) <
      BigInt(
        input.amountBaseUnits,
      ) +
        networkFee +
        rentLamports
    ) {
      throw new Error(
        "insufficient_sol_balance",
      );
    }
  } else {
    const balance =
      await solanaRpc<number>(
        "getBalance",
        [
          input.wallet,
          {
            commitment:
              "confirmed",
          },
        ],
      );

    if (
      BigInt(balance.result) <
      networkFee +
        rentLamports
    ) {
      throw new Error(
        "insufficient_sol_for_network_fee",
      );
    }
  }

  const serialized =
    Buffer.from(
      tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }),
    ).toString("base64");

  const sim =
    await simulate(serialized);

  if (!sim.ok) {
    throw new Error(
      `transfer_simulation_failed:${
        sim.error ?? "unknown"
      }`,
    );
  }

  const instructions =
    tx.instructions.map(
      (instruction, index) => ({
        index,
        programId:
          instruction.programId.toBase58(),
        programName:
          instruction.programId.equals(
            SystemProgram.programId,
          )
            ? "System Program"
            : instruction.programId.equals(
                TOKEN_2022_PROGRAM_ID,
              )
              ? "Token-2022"
              : instruction.programId.equals(
                    TOKEN_PROGRAM_ID,
                  )
                ? "SPL Token"
                : "Associated Token Program",
        accounts: ixAccounts(
          instruction.keys,
          input.asset === "SOL"
            ? [
                "Sender",
                "Recipient",
              ]
            : [],
        ),
        dataBase64:
          Buffer.from(
            instruction.data,
          ).toString("base64"),
        summary:
          input.asset === "SOL"
            ? `Send ${
                input.amountBaseUnits
              } lamports`
            : index ===
                tx.instructions.length -
                  1
              ? `Transfer ${input.asset} with transferChecked`
              : `Create recipient ${input.asset} token account if needed`,
      }),
    );

  const total =
    networkFee +
    rentLamports;

  const plan:
    BuilderPlan = {
      id:
        crypto.randomUUID(),
      cluster:
        process.env
          .NEXT_PUBLIC_SOLANA_CLUSTER ===
        "devnet"
          ? "devnet"
          : "mainnet-beta",
      feePayer:
        input.wallet,
      recentBlockhash:
        block.blockhash,
      instructions,
      fees: {
        networkFeeLamports:
          networkFee.toString(),
        serviceFeeLamports: "0",
        rentLamports:
          rentLamports.toString(),
        totalLamports:
          total.toString(),
      },
      recipients,
      serializedTransactionBase64:
        serialized,
      expiresAt:
        new Date(
          Date.now() + 90_000,
        ).toISOString(),
      simulation: {
        ok: true,
        unitsConsumed:
          sim.unitsConsumed,
      },
      feePolicy: {
        kind: "transfer",
        serviceFeeBps: 0,
        serviceFeeCharged: false,
        networkFeeVariable: true,
        rentVariable: true,
      },
    };

  return {
    plan,
    contract,
  };
}

type JsonTx = {
  slot: number;
  meta?: {
    err: unknown;
    preBalances?: number[];
    postBalances?: number[];
  } | null;
  transaction?: {
    message?: {
      accountKeys?: Array<
        string | {
          pubkey: string;
        }
      >;
    };
  };
};

function keyAt(
  tx: JsonTx,
  index: number,
) {
  const key =
    tx.transaction?.message
      ?.accountKeys?.[index];
  return typeof key === "string"
    ? key
    : key?.pubkey;
}

export async function verifyConfirmedSolTransfer(
  signature: string,
  contract: WalletTransferContract,
) {
  const {
    result,
    endpoint,
  } =
    await solanaRpc<JsonTx | null>(
      "getTransaction",
      [
        signature,
        {
          commitment: "confirmed",
          encoding: "jsonParsed",
          maxSupportedTransactionVersion: 0,
        },
      ],
    );

  if (
    !result ||
    result.meta?.err
  ) {
    return {
      ok: false as const,
      endpoint,
    };
  }

  const keys =
    result.transaction?.message
      ?.accountKeys ?? [];

  const index =
    keys.findIndex(
      (_, position) =>
        keyAt(
          result,
          position,
        ) ===
        contract.recipient,
    );

  if (index < 0) {
    return {
      ok: false as const,
      endpoint,
    };
  }

  const before =
    BigInt(
      result.meta
        ?.preBalances?.[index] ??
        0,
    );

  const after =
    BigInt(
      result.meta
        ?.postBalances?.[index] ??
        0,
    );

  return {
    ok:
      after - before ===
      BigInt(
        contract.amountBaseUnits,
      ),
    endpoint,
    slot: result.slot,
    delta:
      (after - before).toString(),
  };
}
