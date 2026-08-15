import {
  POWERCHAIN_PWRC_DECIMALS,
  POWERCHAIN_PWRC_MINT_ADDRESS,
  SOLANA_USDC_MINT,
  USDC_DECIMALS,
} from "@powerchain/launchpad-config";
import {
  PublicKey,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  solanaRpc,
} from "./solana-rpc";
import {
  getPwrcSolRate,
} from "./integrations/pwrc-sol-rate";

export function configuredPwrcMint() {
  return (
    process.env
      .POWERCHAIN_PRESALE_MINT?.trim() ||
    POWERCHAIN_PWRC_MINT_ADDRESS ||
    null
  );
}

export function configuredUsdcMint() {
  return process.env
    .NEXT_PUBLIC_SOLANA_CLUSTER ===
    "devnet"
    ? SOLANA_USDC_MINT.devnet
    : SOLANA_USDC_MINT[
        "mainnet-beta"
      ];
}

export function tokenAta(
  wallet: string,
  mint: string,
  tokenProgram:
    | typeof TOKEN_PROGRAM_ID
    | typeof TOKEN_2022_PROGRAM_ID,
) {
  return getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(wallet),
    false,
    tokenProgram,
  ).toBase58();
}

export function pwrcAta(
  wallet: string,
  mint: string,
) {
  return tokenAta(
    wallet,
    mint,
    TOKEN_2022_PROGRAM_ID,
  );
}

export function usdcAta(
  wallet: string,
  mint = configuredUsdcMint(),
) {
  return tokenAta(
    wallet,
    mint,
    TOKEN_PROGRAM_ID,
  );
}

type TokenBalanceResult = {
  value: {
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  };
};

async function readTokenBalance(
  tokenAccount: string,
  fallbackDecimals: number,
) {
  try {
    const balance =
      await solanaRpc<TokenBalanceResult>(
        "getTokenAccountBalance",
        [
          tokenAccount,
          {
            commitment: "confirmed",
          },
        ],
      );

    return {
      amountBaseUnits:
        balance.result.value.amount,
      decimals:
        balance.result.value.decimals,
      uiAmount:
        balance.result.value
          .uiAmountString,
      exists: true,
    };
  } catch {
    return {
      amountBaseUnits: "0",
      decimals: fallbackDecimals,
      uiAmount: "0",
      exists: false,
    };
  }
}

export async function getWalletAssetData(
  wallet: string,
) {
  const mint =
    configuredPwrcMint();
  const usdcMint =
    configuredUsdcMint();

  const [
    solResult,
    rate,
  ] = await Promise.all([
    solanaRpc<number>(
      "getBalance",
      [
        wallet,
        {
          commitment: "confirmed",
        },
      ],
    ),
    mint
      ? getPwrcSolRate(mint)
      : Promise.resolve(null),
  ]);

  const pwrcAccount =
    mint
      ? pwrcAta(wallet, mint)
      : null;

  const usdcAccount =
    usdcAta(wallet, usdcMint);

  const [
    pwrcBalance,
    usdcBalance,
  ] = await Promise.all([
    pwrcAccount
      ? readTokenBalance(
          pwrcAccount,
          POWERCHAIN_PWRC_DECIMALS,
        )
      : Promise.resolve({
          amountBaseUnits: "0",
          decimals:
            POWERCHAIN_PWRC_DECIMALS,
          uiAmount: "0",
          exists: false,
        }),
    readTokenBalance(
      usdcAccount,
      USDC_DECIMALS,
    ),
  ]);

  const solLamports =
    BigInt(solResult.result);
  const solUi =
    Number(solLamports) /
    1_000_000_000;

  const solUsd =
    rate?.solUsd ?? null;
  const pwrcUsd =
    rate?.pwrcUsd ?? null;
  const pwrcUi =
    Number(pwrcBalance.uiAmount);
  const usdcUi =
    Number(usdcBalance.uiAmount);

  return {
    wallet,
    cluster:
      process.env
        .NEXT_PUBLIC_SOLANA_CLUSTER ===
      "devnet"
        ? "devnet"
        : "mainnet-beta",

    sol: {
      lamports:
        solLamports.toString(),
      uiAmount: solUi,
      priceUsd: solUsd,
      valueUsd:
        solUsd === null
          ? null
          : solUi * solUsd,
    },

    pwrc: {
      mint,
      tokenAccount:
        pwrcAccount,
      amountBaseUnits:
        pwrcBalance.amountBaseUnits,
      decimals:
        pwrcBalance.decimals,
      uiAmount:
        pwrcBalance.uiAmount,
      configured:
        Boolean(mint),
      priceUsd: pwrcUsd,
      valueUsd:
        pwrcUsd === null
          ? null
          : pwrcUi * pwrcUsd,
    },

    usdc: {
      mint: usdcMint,
      tokenAccount:
        usdcAccount,
      amountBaseUnits:
        usdcBalance.amountBaseUnits,
      decimals:
        usdcBalance.decimals,
      uiAmount:
        usdcBalance.uiAmount,
      configured: true,
      priceUsd: 1,
      valueUsd: usdcUi,
    },

    conversion: rate
      ? {
          available:
            rate.available,
          pwrcPerSol:
            rate.pwrcPerSol,
          solPerPwrc:
            rate.solPerPwrc,
          provider:
            rate.provider,
          observedAt:
            rate.observedAt,
        }
      : null,

    rpc: {
      endpoint:
        solResult.endpoint,
      latencyMs:
        solResult.latencyMs,
    },

    links: {
      transactions:
        `/api/v1/transactions?wallet=${encodeURIComponent(
          wallet,
        )}`,
      transferPrepare:
        "/api/v1/transfers/prepare",
      transferConfirm:
        "/api/v1/transfers/confirm",
    },
  };
}
