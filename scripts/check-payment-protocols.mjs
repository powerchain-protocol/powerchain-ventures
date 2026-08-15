import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const failures = [];
const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

for (const rel of [
  "packages/config/src/payments.ts",
  "packages/config/src/solana-programs.ts",
  "packages/solana/src/tokens.ts",
  "packages/solana/src/pay.ts",
  "packages/solana/src/settlement.ts",
  "packages/integrations/src/cctp.ts",
  "packages/integrations/src/zk-compression.ts",
  "apps/backend/lib/payments/solana-pay.ts",
  "apps/backend/app/api/v1/payments/solana-pay/transaction/route.ts",
  "apps/backend/app/api/v1/payments/solana-pay/status/route.ts",
  "apps/backend/app/api/v1/solana/settlement/route.ts",
  "apps/backend/app/api/v1/payments/config/route.ts",
  "apps/backend/app/api/v1/protocols/route.ts",
  "apps/checkout/components/solana-pay-qr.tsx",
  "scripts/pay.sh",
]) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const programs =
  read(
    "packages/config/src/solana-programs.ts",
  );

for (const value of [
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  "rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ",
  "pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT",
  "rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp",
  "pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou",
  "CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC",
  "CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe",
  "NFLx5WGPrTHHvdRNsidcrNcLxRruMC92E4yv7zhZBoT",
]) {
  if (!programs.includes(value)) {
    failures.push(`program/protocol constant missing: ${value}`);
  }
}

const payments =
  read(
    "packages/config/src/payments.ts",
  );

if (
  !payments.includes(
    'id: "sol-pwrc"',
  ) ||
  !payments.includes(
    "enabled: true",
  ) ||
  !payments.includes(
    'return "sol-pwrc" as const',
  )
) {
  failures.push(
    "SOL -> PWRC must remain the enabled default payment method",
  );
}

for (const flag of [
  "NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED",
  "NEXT_PUBLIC_STRIPE_ENABLED",
  "NEXT_PUBLIC_USDC_PURCHASE_ENABLED",
  "NEXT_PUBLIC_CCTP_ENABLED",
  "NEXT_PUBLIC_SUI_PURCHASE_ENABLED",
  "NEXT_PUBLIC_ZK_COMPRESSION_ENABLED",
]) {
  const fragment =
    payments.slice(
      Math.max(
        0,
        payments.indexOf(flag) - 160,
      ),
      payments.indexOf(flag) + 180,
    );

  if (
    !fragment.includes(
      "false",
    )
  ) {
    failures.push(
      `${flag} must be fail-closed by default`,
    );
  }
}

const pay =
  read(
    "packages/solana/src/pay.ts",
  );

for (const guard of [
  "solana:",
  "spl-token",
  "reference",
  "encodeSolanaPayTransactionRequest",
  "@solana/web3.js",
]) {
  if (!pay.includes(guard)) {
    failures.push(
      `Solana Pay codec missing ${guard}`,
    );
  }
}


const checkoutProxy =
  read(
    "apps/checkout/app/api/v1/[...path]/route.ts",
  );
const backendProxy =
  read(
    "packages/utils/src/backend-proxy.ts",
  );

if (
  !checkoutProxy.includes(
    "export const OPTIONS = forward",
  )
) {
  failures.push(
    "Checkout API proxy must forward Solana Pay OPTIONS preflight",
  );
}

if (
  !backendProxy.includes(
    'request.method ===\n      "OPTIONS"',
  )
) {
  failures.push(
    "Shared backend proxy must treat OPTIONS as a no-body safe request",
  );
}

const transactionRoute =
  read(
    "apps/backend/app/api/v1/payments/solana-pay/transaction/route.ts",
  );

for (const guard of [
  "access-control-allow-origin",
  "OPTIONS",
  "review.wallet !==",
  "serializedTransactionBase64",
  "Wallet does not match the prepared purchase",
  "Prepared purchase is no longer signable",
]) {
  if (!transactionRoute.includes(guard)) {
    failures.push(
      `Solana Pay transaction route missing ${guard}`,
    );
  }
}

const status =
  read(
    "apps/backend/lib/payments/solana-pay.ts",
  );

for (const guard of [
  "getSignaturesForAddress",
  "verifyTransactionMatchesPrepared",
  "participantPda",
]) {
  if (!status.includes(guard)) {
    failures.push(
      `Solana Pay status matching missing ${guard}`,
    );
  }
}

const qr =
  read(
    "apps/checkout/components/solana-pay-qr.tsx",
  );

for (const guard of [
  "QRCode.toCanvas",
  "encodeSolanaPayTransactionRequest",
  "solanaPayStatus",
  "never signs or resubmits",
]) {
  if (!qr.includes(guard)) {
    failures.push(
      `Checkout Solana Pay QR missing ${guard}`,
    );
  }
}

const stripe =
  read(
    "apps/checkout/components/stripe-funding.tsx",
  );

if (
  /name=["'](?:cardNumber|cvv|cvc|expiry)["']/i.test(
    stripe,
  )
) {
  failures.push(
    "Stripe integration must not collect raw card fields",
  );
}

const cctp =
  read(
    "packages/integrations/src/cctp.ts",
  );

for (const guard of [
  "CCTP_V2_SOLANA_DOMAIN",
  "/v2/messages/",
  "iris-api.circle.com",
]) {
  if (!cctp.includes(guard)) {
    failures.push(
      `CCTP V2 integration missing ${guard}`,
    );
  }
}

const zk =
  read(
    "packages/integrations/src/zk-compression.ts",
  );

for (const guard of [
  "POWERCHAIN_ZK_COMPRESSION_ENABLED",
  "ZK_COMPRESSION_RPC_URL",
  "zk_compression_disabled",
]) {
  if (!zk.includes(guard)) {
    failures.push(
      `ZK Compression guard missing ${guard}`,
    );
  }
}

const helper =
  read(
    "scripts/pay.sh",
  );

if (
  !helper.includes(
    "does not sign or submit",
  ) ||
  /solana transfer|sendTransaction|sendRawTransaction/.test(
    helper,
  )
) {
  failures.push(
    "pay.sh must remain a non-signing URL helper",
  );
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      defaultPayment:
        "sol-pwrc",
      solanaPay:
        true,
      optionalRails: [
        "coinbase-onramp",
        "stripe",
        "usdc",
        "cctp-v2",
        "sui",
        "zk-compression",
      ],
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) {
  process.exit(1);
}
