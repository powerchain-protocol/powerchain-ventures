import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");

test("frontend mainnet RPC uses backend proxy and exposes no Helius key", () => {
  const env = read("apps/frontend/.env.example");
  assert.match(env, /^NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta$/m);
  assert.match(
    env,
    /^NEXT_PUBLIC_SOLANA_RPC_URL=http:\/\/localhost:3001\/api\/v1\/solana\/rpc$/m,
  );
  assert.doesNotMatch(env, /^HELIUS_API_KEY=/m);
});

test("backend supports Helius, custom and automatic RPC selection", () => {
  const env = read("apps/backend/.env.example");
  assert.match(env, /^SOLANA_RPC_PROVIDER=auto$/m);
  assert.match(env, /^HELIUS_RPC_URL=https:\/\/mainnet\.helius-rpc\.com\/$/m);
  assert.match(env, /^HELIUS_API_URL=https:\/\/api\.helius\.xyz$/m);
  assert.match(env, /^CUSTOM_SOLANA_RPC_URL=/m);
});

test("CORS stores multiple origins only in ALLOWED_ORIGINS", () => {
  const env = read("apps/backend/.env.example");
  assert.match(
    env,
    /^ALLOWED_ORIGINS=http:\/\/localhost:3000,http:\/\/localhost:3002,https:\/\/launchpad\.powerchain\.energy,https:\/\/checkout\.powerchain\.energy$/m,
  );
  assert.match(env, /^BACKEND_ORIGIN=http:\/\/localhost:3001$/m);
});

test("backend owns browser-safe Solana JSON-RPC proxy", () => {
  const route = read("apps/backend/app/api/v1/solana/rpc/route.ts");
  assert.match(route, /solanaRpc<unknown>/);
  assert.match(route, /jsonrpc: "2.0"/);
});
