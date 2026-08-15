import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = rel =>
  fs.readFileSync(
    rel,
    "utf8",
  );

test("SOL to PWRC is the always-enabled default payment method", () => {
  const source =
    read(
      "packages/config/src/payments.ts",
    );

  assert.match(
    source,
    /id: "sol-pwrc"[\s\S]*enabled: true[\s\S]*settlement:\s*"purchase"/,
  );
  assert.match(
    source,
    /return "sol-pwrc" as const/,
  );
});

test("optional payment rails fail closed by default", () => {
  const source =
    read(
      "packages/config/src/payments.ts",
    );

  for (const flag of [
    "NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED",
    "NEXT_PUBLIC_STRIPE_ENABLED",
    "NEXT_PUBLIC_USDC_PURCHASE_ENABLED",
    "NEXT_PUBLIC_CCTP_ENABLED",
    "NEXT_PUBLIC_SUI_PURCHASE_ENABLED",
    "NEXT_PUBLIC_ZK_COMPRESSION_ENABLED",
  ]) {
    const index =
      source.indexOf(flag);

    assert.notEqual(
      index,
      -1,
      flag,
    );

    assert.match(
      source.slice(
        index,
        index + 180,
      ),
      /false/,
      flag,
    );
  }
});

test("canonical Solana token and protocol addresses are centralized", () => {
  const source =
    read(
      "packages/config/src/solana-programs.ts",
    );

  for (const address of [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    "rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp",
    "pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou",
    "CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC",
    "CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe",
  ]) {
    assert.match(
      source,
      new RegExp(address),
    );
  }
});

test("shared Solana package uses web3.js and SPL Token for Token-2022 ATA handling", () => {
  const source =
    read(
      "packages/solana/src/tokens.ts",
    );

  assert.match(
    source,
    /@solana\/web3\.js/,
  );
  assert.match(
    source,
    /@solana\/spl-token/,
  );
  assert.match(
    source,
    /TOKEN_2022_PROGRAM_ID/,
  );
  assert.match(
    source,
    /getAssociatedTokenAddressSync/,
  );
});

test("Solana Pay transaction requests are buyer-bound and CORS-compatible", () => {
  const route =
    read(
      "apps/backend/app/api/v1/payments/solana-pay/transaction/route.ts",
    );

  assert.match(
    route,
    /access-control-allow-origin/,
  );
  assert.match(
    route,
    /export async function OPTIONS/,
  );
  assert.match(
    route,
    /review\.wallet !==\s*body\.account/,
  );
  assert.match(
    route,
    /serializedTransactionBase64/,
  );
  assert.match(
    route,
    /review\.status !==\s*"prepared"/,
  );
});

test("Solana Pay status discovers signatures but requires exact prepared-message match", () => {
  const source =
    read(
      "apps/backend/lib/payments/solana-pay.ts",
    );

  assert.match(
    source,
    /getSignaturesForAddress/,
  );
  assert.match(
    source,
    /verifyTransactionMatchesPrepared/,
  );
  assert.doesNotMatch(
    source,
    /sendRawTransaction|sendTransaction/,
  );
});

test("Checkout QR polling never submits a transaction", () => {
  const source =
    read(
      "apps/checkout/components/solana-pay-qr.tsx",
    );

  assert.match(
    source,
    /QRCode\.toCanvas/,
  );
  assert.match(
    source,
    /solanaPayStatus/,
  );
  assert.doesNotMatch(
    source,
    /signAndSend|sendRawTransaction|sendTransaction/,
  );
});

test("CCTP V2 and ZK integrations are protocol-gated", () => {
  const cctp =
    read(
      "packages/integrations/src/cctp.ts",
    );
  const zk =
    read(
      "packages/integrations/src/zk-compression.ts",
    );

  assert.match(
    cctp,
    /\/v2\/messages\//,
  );
  assert.match(
    cctp,
    /CCTP_V2_SOLANA_DOMAIN/,
  );
  assert.match(
    zk,
    /POWERCHAIN_ZK_COMPRESSION_ENABLED/,
  );
  assert.match(
    zk,
    /ZK_COMPRESSION_RPC_URL/,
  );
  assert.match(
    zk,
    /zk_compression_disabled/,
  );
});

test("Stripe remains provider-hosted with no raw card fields", () => {
  const source =
    read(
      "apps/checkout/components/stripe-funding.tsx",
    );

  assert.match(
    source,
    /provider-hosted|Provider-hosted/,
  );
  assert.doesNotMatch(
    source,
    /name=["'](?:cardNumber|cvv|cvc|expiry)/i,
  );
});

test("pay.sh prints a Solana Pay URL without signing or submitting", () => {
  const source =
    read(
      "scripts/pay.sh",
    );

  assert.match(
    source,
    /solana:/,
  );
  assert.match(
    source,
    /does not sign or submit/,
  );
  assert.doesNotMatch(
    source,
    /solana transfer|sendRawTransaction/,
  );
});


test("checkout proxy forwards Solana Pay preflight without a request body", () => {
  const route =
    read(
      "apps/checkout/app/api/v1/[...path]/route.ts",
    );
  const proxy =
    read(
      "packages/utils/src/backend-proxy.ts",
    );

  assert.match(
    route,
    /export const OPTIONS = forward/,
  );
  assert.match(
    proxy,
    /request\.method ===\s*"OPTIONS"/,
  );
});
