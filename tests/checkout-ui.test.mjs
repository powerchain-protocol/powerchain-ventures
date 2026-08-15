import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = [
  "apps/checkout/components/purchase-flow.tsx",
  "apps/checkout/components/payment-methods.tsx",
  "apps/checkout/components/transaction-review.tsx",
  "apps/checkout/components/onramp.tsx",
  "apps/checkout/components/purchase-success.tsx",
  "apps/checkout/components/wallet-button.tsx",
];

test("dedicated PowerChain checkout component stack exists", () => {
  for (const file of files) assert.ok(existsSync(file), file);
});

test("checkout uses PowerChain branding only", () => {
  const text = files.map(file => readFileSync(file, "utf8")).join("\n");
  assert.match(text, /PowerChain|PowerChain Checkout/);
  assert.doesNotMatch(text, /PowerPay Checkout|Powered by PowerPay/i);
});

test("card payment is disabled without rendering raw card secrets", () => {
  const methods = readFileSync(
    "apps/checkout/components/payment-methods.tsx",
    "utf8",
  );
  const flow = readFileSync(
    "apps/checkout/components/purchase-flow.tsx",
    "utf8",
  );
  assert.match(methods, /disabled:\s*true/);
  assert.match(methods, /Provider required/);
  assert.doesNotMatch(`${methods}\n${flow}`, /name=["'](?:card|cvv|expiry|pan)["']/i);
});

test("checkout exposes verified completion receipt and transaction explorer", () => {
  const success = readFileSync(
    "apps/checkout/components/purchase-success.tsx",
    "utf8",
  );
  const flow = readFileSync(
    "apps/checkout/components/purchase-flow.tsx",
    "utf8",
  );
  const service = readFileSync(
    "apps/checkout/services/checkout-service.ts",
    "utf8",
  );
  assert.match(success, /Purchase successful/);
  assert.match(success, /explorer\.solana\.com\/tx/);
  assert.match(service, /purchase\/confirm/);
  assert.match(flow, /confirmUntilSettled/);
});

test("frontend no longer owns checkout or purchase forms", () => {
  assert.equal(existsSync("apps/frontend/app/checkout"), false);
  assert.equal(existsSync("apps/frontend/components/checkout"), false);
  assert.equal(
    existsSync("apps/frontend/components/launchpad/purchase-experience.tsx"),
    false,
  );
  const sale = readFileSync(
    "apps/frontend/components/launchpad/sale-overview.tsx",
    "utf8",
  );
  assert.match(sale, /NEXT_PUBLIC_CHECKOUT_URL/);
  assert.match(sale, /Continue to secure checkout/);
});
