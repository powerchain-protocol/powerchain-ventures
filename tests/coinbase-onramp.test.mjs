import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(path, "utf8");

test("Coinbase-hosted Onramp is server-created and targets SOL on Solana", () => {
  const server = read("apps/backend/lib/cdp-onramp.ts");
  const checkout = read("apps/checkout/components/onramp.tsx");
  assert.match(server, /platform\/v2\/onramp\/sessions/);
  assert.match(server, /purchaseCurrency:"SOL"/);
  assert.match(server, /destinationNetwork:"solana"/);
  assert.match(server, /generateJwt/);
  assert.doesNotMatch(checkout, /CDP_API_KEY_SECRET|CDP_API_KEY_ID/);
});

test("Onramp session is idempotent rate-limited and audited without persisting hosted URL", () => {
  const route = read("apps/backend/app/api/v1/onramp/session/route.ts");
  assert.match(route, /requireIdempotency:true/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /launchpad_onramp_sessions/);
  assert.doesNotMatch(
    read("database/migrations/026_coinbase_hosted_onramp.sql"),
    /onramp_url|session_token/i,
  );
});

test("Onramp funds the wallet and does not replace reviewed token purchase", () => {
  const checkout = read("apps/checkout/components/onramp.tsx");
  assert.match(checkout, /funds SOL|Fund your Solana wallet/);
  assert.match(checkout, /actual token[\s\S]*separate[\s\S]*reviewed Solana[\s\S]*transaction/i);
  assert.match(read("docs/COINBASE-ONRAMP.md"), /June 30, 2026/);
});
