import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const exists = (file) => fs.existsSync(new URL(`../${file}`, import.meta.url));

test("header wallet CTA uses only wallet icon and simple text", () => {
  const wallet = read("apps/frontend/components/wallet-button.tsx");
  const css = read("apps/frontend/app/styles.css");
  assert.match(wallet, /function WalletIcon/);
  assert.match(wallet, />Wallet<\/span>/);
  assert.match(wallet, /Connect Wallet/);
  assert.doesNotMatch(wallet, /wallet-button-dot/);
  assert.doesNotMatch(wallet, /wallet-chevron/);
  assert.doesNotMatch(wallet, /<span>\{shortenWalletAddress\(address\)\}<\/span>/);
  assert.match(css, /@media\(max-width:520px\)[\s\S]*\.wallet-button-label/);
});

test("shortAddress is explicitly available through frontend helpers", () => {
  const helpers = read("apps/frontend/lib/helpers.ts");
  assert.match(helpers, /export function shortAddress\(/);
});

test("frontend and checkout API routes use shared resilient backend proxy", () => {
  const shared = read("packages/utils/src/backend-proxy.ts");
  const frontend = read("apps/frontend/app/api/v1/[...path]/route.ts");
  const checkout = read("apps/checkout/app/api/v1/[...path]/route.ts");
  const config = read("apps/frontend/next.config.ts");

  assert.match(shared, /BACKEND_UNAVAILABLE/);
  assert.match(shared, /BACKEND_FALLBACK_ORIGINS/);
  assert.match(shared, /status:\s*503/);
  assert.match(frontend, /forwardBackendRequest/);
  assert.match(checkout, /forwardBackendRequest/);
  assert.doesNotMatch(config, /async rewrites\(\)/);
});

test("onboarding is mobile-only and desktop landing remains public", () => {
  const proxy = read("apps/frontend/proxy.ts");
  const onboarding = read("apps/frontend/components/auth/onboarding-flow.tsx");
  assert.match(proxy, /MOBILE_USER_AGENT/);
  assert.match(proxy, /pathname === "\/"/);
  assert.match(onboarding, /matchMedia\("\(max-width: 720px\)"\)/);
  assert.match(onboarding, /router\.replace\("\/"\)/);
});

test("missing product and legal pages are present", () => {
  for (const page of [
    "docs",
    "eligibility",
    "vesting",
    "settings",
    "security",
    "legal",
    "legal/privacy",
    "legal/terms",
    "legal/cookies",
  ]) {
    assert.ok(exists(`apps/frontend/app/${page}/page.tsx`), `${page} page must exist`);
  }
});
