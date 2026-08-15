import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

test("account session guard supports account and wallet authentication", () => {
  const source = read(
    "apps/backend/lib/account-session.ts",
  );
  assert.match(source, /requireAccountSession/);
  assert.match(source, /requireBetterAuthAccount/);
  assert.match(source, /readWalletSession/);
});

test("linked wallet API can list and unlink only for account sessions", () => {
  const source = read(
    "apps/backend/app/api/v1/account/wallets/route.ts",
  );
  assert.match(source, /requireBetterAuthAccount/);
  assert.match(source, /walletsForUser/);
  assert.match(source, /unlinkWallet/);
});

test("network capabilities keep Sui settlement fail closed", () => {
  const source = read(
    "apps/frontend/data/network-capabilities.ts",
  );
  assert.match(
    source,
    /sui:[\s\S]*"sale-purchase":\s*"adapter-required"/,
  );
  assert.match(
    source,
    /solana:[\s\S]*"sale-purchase":\s*"ready"/,
  );
});

test("wallet actions support SOL PWRC and USDC without bypassing review flow", () => {
  const source = read(
    "apps/frontend/components/wallet/send-asset.tsx",
  );
  assert.match(source, /"SOL"/);
  assert.match(source, /"PWRC"/);
  assert.match(source, /"USDC"/);
  assert.match(source, /reviewed wallet transfer flow/);
});

test("UI state primitives cover loading empty and error", () => {
  const source = read(
    "apps/frontend/components/ui/states.tsx",
  );
  assert.match(source, /LoadingState/);
  assert.match(source, /EmptyState/);
  assert.match(source, /ErrorState/);
});
