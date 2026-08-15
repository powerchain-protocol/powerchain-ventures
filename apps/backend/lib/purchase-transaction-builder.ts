import {
  Buffer,
} from "node:buffer";
import {
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  buildPurchaseOperation,
  operationToReview,
} from "@powerchain/launchpad-program-client";
import {
  POWERCHAIN_FEE_WALLET_ADDRESS,
} from "@powerchain/launchpad-config";
import {
  solPaymentAmounts,
} from "./integrations/prices";
import {
  solanaRpc,
} from "./solana-rpc";
import type {
  BuilderPlan,
} from "./transaction-builder";

type PurchaseBuilderInput = {
  wallet: string;
  mint: string;
  sourceVaultTokenAccount: string;
  paymentReceiverWallet: string;
  programId: string;
  salePda: string;
  purchaseNonce: string;
  quoteAuthorityWallet: string;
  tokenBaseUnits: string;
  usdMicros: string;
  serviceFeeUsdMicros: string;
  deliveryMode:
    | "immediate"
    | "claim";
};

type SignatureStatusResult = {
  value: unknown | null;
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

function quoteAuthorityKeypair() {
  const raw =
    process.env
      .POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON
      ?.trim();

  if (!raw) {
    throw new Error(
      "quote_authority_keypair_not_configured",
    );
  }

  let values: unknown;

  try {
    values = JSON.parse(raw);
  } catch {
    throw new Error(
      "quote_authority_keypair_json_invalid",
    );
  }

  if (
    !Array.isArray(values) ||
    values.length !== 64 ||
    values.some(
      value =>
        !Number.isInteger(value) ||
        Number(value) < 0 ||
        Number(value) > 255,
    )
  ) {
    throw new Error(
      "quote_authority_keypair_json_invalid",
    );
  }

  const keypair =
    Keypair.fromSecretKey(
      Uint8Array.from(
        values as number[],
      ),
    );

  return keypair;
}

async function accountExists(
  address: string,
) {
  const response =
    await solanaRpc<SignatureStatusResult>(
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

async function networkFee(
  tx: Transaction,
) {
  const message =
    Buffer.from(
      tx.compileMessage().serialize(),
    ).toString("base64");

  const response =
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
        unitsConsumed?: number;
        logs?: string[] | null;
      };
    }>(
      "simulateTransaction",
      [
        serializedBase64,
        {
          encoding: "base64",
          sigVerify: false,
          commitment: "processed",
        },
      ],
    );

  return {
    ok:
      response.result.value.err ==
      null,
    unitsConsumed:
      response.result.value
        .unitsConsumed,
    error:
      response.result.value.err
        ? JSON.stringify(
            response.result.value.err,
          )
        : undefined,
  };
}

export async function buildLocalPurchaseTransaction(
  input: PurchaseBuilderInput,
): Promise<BuilderPlan & {
  marketPrice: {
    asset: "SOL";
    priceUsd: number;
    priceUsdMicros: string;
    observedAt: string;
    providers: string[];
    maxDivergenceBps:
      number | null;
  };
}> {
  const buyer =
    new PublicKey(
      input.wallet,
    );
  const mint =
    new PublicKey(
      input.mint,
    );
  const quoteAuthority =
    quoteAuthorityKeypair();

  if (
    quoteAuthority.publicKey.toBase58() !==
    input.quoteAuthorityWallet
  ) {
    throw new Error(
      "quote_authority_keypair_mismatch",
    );
  }

  const destination =
    getAssociatedTokenAddressSync(
      mint,
      buyer,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

  const destinationExists =
    await accountExists(
      destination.toBase58(),
    );

  const payment =
    await solPaymentAmounts(
      input.usdMicros,
      input.serviceFeeUsdMicros,
    );

  const operation =
    buildPurchaseOperation({
      programId:
        input.programId,
      salePda:
        input.salePda,
      wallet:
        input.wallet,
      quoteAuthorityWallet:
        input.quoteAuthorityWallet,
      sourceVaultTokenAccount:
        input.sourceVaultTokenAccount,
      destinationTokenAccount:
        destination.toBase58(),
      mint:
        input.mint,
      paymentReceiverWallet:
        input.paymentReceiverWallet,
      tokenAmountBaseUnits:
        input.tokenBaseUnits,
      paymentLamports:
        payment.principalLamports.toString(),
      serviceFeeLamports:
        payment.serviceFeeLamports.toString(),
      purchaseNonce:
        input.purchaseNonce,
    });

  const latest =
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

  const tx =
    new Transaction({
      feePayer: buyer,
      recentBlockhash:
        latest.result.blockhash,
    });

  let rentLamports = 0n;

  if (!destinationExists) {
    tx.add(
      createAssociatedTokenAccountIdempotentInstruction(
        buyer,
        destination,
        buyer,
        mint,
        TOKEN_2022_PROGRAM_ID,
      ),
    );

    rentLamports =
      await tokenAccountRent();
  }

  tx.add(
    operation.instruction,
  );

  // The quote authority signs the exact purchase instruction on the
  // server. The buyer signature remains empty and must be supplied by
  // the connected wallet after review.
  tx.partialSign(
    quoteAuthority,
  );

  const networkFeeLamports =
    await networkFee(tx);

  const serialized =
    Buffer.from(
      tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }),
    ).toString("base64");

  const simulation =
    await simulate(
      serialized,
    );

  if (!simulation.ok) {
    throw new Error(
      `purchase_simulation_failed:${
        simulation.error ??
        "unknown"
      }`,
    );
  }

  const instructions =
    tx.instructions.map(
      (instruction, index) => {
        if (
          instruction.programId.equals(
            operation.instruction.programId,
          )
        ) {
          return {
            ...operationToReview(
              operation,
              index,
            ),
            index,
          };
        }

        return {
          index,
          programId:
            instruction.programId.toBase58(),
          programName:
            "Associated Token Program",
          accounts:
            instruction.keys.map(
              (key, accountIndex) => ({
                address:
                  key.pubkey.toBase58(),
                signer:
                  key.isSigner,
                writable:
                  key.isWritable,
                label:
                  [
                    "Fee payer",
                    "Destination token account",
                    "Wallet owner",
                    "PWRC mint",
                    "System program",
                    "Token program",
                  ][accountIndex] ??
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
            "Create the buyer Token-2022 associated token account if it does not already exist.",
        };
      },
    );

  const totalLamports =
    networkFeeLamports +
    payment.serviceFeeLamports +
    rentLamports;

  const plan: BuilderPlan = {
    id:
      crypto.randomUUID(),
    cluster: cluster(),
    feePayer:
      input.wallet,
    recentBlockhash:
      latest.result.blockhash,
    programOperation: {
      programId:
        input.programId,
      operation:
        "purchase",
      salePda:
        input.salePda,
      participantPda:
        operation.participantPda,
      instructionDataBase64:
        Buffer.from(
          operation.instruction.data,
        ).toString("base64"),
      purchaseNonce:
        input.purchaseNonce,
    },
    paymentSettlement: {
      assetKind:
        "native-sol",
      paymentAmountBaseUnits:
        payment.principalLamports.toString(),
      serviceFeeBaseUnits:
        payment.serviceFeeLamports.toString(),
      paymentReceiverWallet:
        input.paymentReceiverWallet,
      powerchainTreasuryWallet:
        POWERCHAIN_FEE_WALLET_ADDRESS,
    },
    instructions,
    fees: {
      networkFeeLamports:
        networkFeeLamports.toString(),
      serviceFeeLamports:
        payment.serviceFeeLamports.toString(),
      rentLamports:
        rentLamports.toString(),
      totalLamports:
        totalLamports.toString(),
    },
    recipients: [
      {
        address:
          input.paymentReceiverWallet,
        label:
          "Sale proceeds wallet",
        amountBaseUnits:
          payment.principalLamports.toString(),
      },
      {
        address:
          POWERCHAIN_FEE_WALLET_ADDRESS,
        label:
          "PowerChain 2.5% service fee",
        amountBaseUnits:
          payment.serviceFeeLamports.toString(),
      },
      ...(input.deliveryMode ===
      "immediate"
        ? [
            {
              address:
                destination.toBase58(),
              label:
                "Buyer PWRC Token-2022 account",
              amountBaseUnits:
                input.tokenBaseUnits,
              mint:
                input.mint,
            },
          ]
        : []),
    ],
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

  return {
    ...plan,
    marketPrice: {
      asset: "SOL",
      priceUsd:
        payment.sol.priceUsd!,
      priceUsdMicros:
        payment.sol.priceUsdMicros!,
      observedAt:
        payment.sol.observedAt,
      providers:
        payment.sol.sources.map(
          source =>
            source.provider,
        ),
      maxDivergenceBps:
        payment.sol.maxDivergenceBps,
    },
  };
}
