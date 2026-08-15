import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel =>
  fs.readFileSync(path.join(root, rel), "utf8");

test("monorepo has one dedicated checkout app and no payload app", () => {
  assert.equal(fs.existsSync(path.join(root, "apps/checkout/package.json")), true);
  assert.equal(fs.existsSync(path.join(root, "apps/payload")), false);
  assert.equal(fs.existsSync(path.join(root, "payload")), false);
  assert.equal(fs.existsSync(path.join(root, "apps/frontend/app/checkout")), false);
});

test("purchase preparation uses local Solana builder instead of remote transaction builder", () => {
  const route = read("apps/backend/app/api/v1/launchpad/purchase/prepare/route.ts");
  const builder = read("apps/backend/lib/purchase-transaction-builder.ts");
  assert.match(route, /buildLocalPurchaseTransaction/);
  assert.doesNotMatch(route, /buildTransaction\("purchase"/);
  assert.match(builder, /buildPurchaseOperation/);
  assert.match(builder, /partialSign/);
  assert.match(builder, /simulateTransaction/);
  assert.match(builder, /POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON/);
});

test("purchase builder derives SOL payment from backend market price and exact 250 bps fee", () => {
  const prices = read("apps/backend/lib/integrations/prices.ts");
  const settlement = read("apps/backend/lib/payment-settlement.ts");
  assert.match(prices, /usdMicrosToLamports/);
  assert.match(prices, /principalLamports\s*\*\s*250n/);
  assert.match(prices, /price\.stale/);
  assert.match(settlement, /SERVICE_FEE_BPS/);
  assert.match(settlement, /const expected=.*POWERCHAIN_SERVICE_FEE_BPS/);
});

test("market providers are modular server-side integrations", () => {
  const pyth = read("packages/integrations/src/pyth.ts");
  const birdeye = read("packages/integrations/src/birdeye.ts");
  const cmc = read("packages/integrations/src/coinmarketcap.ts");
  assert.match(pyth, /pyth\.dourolabs\.app\/hermes/);
  assert.match(pyth, /v2\/updates\/price\/latest/);
  assert.match(birdeye, /public-api\.birdeye\.so/);
  assert.match(cmc, /pro-api\.coinmarketcap\.com/);
  assert.match(cmc, /X-CMC_PRO_API_KEY/);
});

test("purchase preparation is caller-idempotent and pending confirmation never auto-resubmits", () => {
  const prepare = read("apps/backend/app/api/v1/launchpad/purchase/prepare/route.ts");
  const flow = read("apps/checkout/components/purchase-flow.tsx");
  assert.match(prepare, /requireIdempotency:true/);
  assert.match(flow, /pending-purchase\.v1/);
  assert.match(flow, /will not resubmit it automatically/);
  assert.doesNotMatch(flow, /signAndSend\([\s\S]*readPendingPurchase/);
});

test("submitted purchase confirmation survives review expiry but rejects signature substitution", () => {
  const confirm = read("apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts");
  assert.match(confirm, /submitted_signature&&review\.submitted_signature!==signature/);
  assert.match(confirm, /review\.status==="prepared"&&!review\.submitted_signature/);
  assert.match(confirm, /expired before submission/);
});

test("checkout card rail remains provider-gated and hosted Onramp is wallet funding only", () => {
  const methods = read("apps/checkout/components/payment-methods.tsx");
  const onramp = read("apps/checkout/components/onramp.tsx");
  assert.match(methods, /Provider required/);
  assert.match(methods, /disabled:\s*true/);
  assert.match(onramp, /funds SOL/);
  assert.match(onramp, /actual token[\s\S]*separate/);
});
