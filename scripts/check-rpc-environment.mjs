import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const required = [
  "env/README.md",
  "env/local.example",
  "env/production.example",
  "env/mainnet-beta.example",
  "env/devnet.example",
  ".env.example",
  ".env.production.example",
  "apps/frontend/.env.example",
  "apps/frontend/.env.production.example",
  "apps/backend/.env.example",
  "apps/backend/.env.production.example",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const frontend = fs.readFileSync(
  path.join(root, "apps/frontend/.env.example"),
  "utf8",
);
for (const secret of [
  "HELIUS_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "POWERCHAIN_TRANSACTION_BUILDER_API_KEY",
  "CDP_API_KEY_SECRET",
]) {
  if (new RegExp(`^${secret}=`, "m").test(frontend)) {
    failures.push(`frontend environment exposes ${secret}`);
  }
}

const backend = fs.readFileSync(
  path.join(root, "apps/backend/.env.example"),
  "utf8",
);
for (const key of [
  "SOLANA_RPC_PROVIDER",
  "HELIUS_API_KEY",
  "HELIUS_RPC_URL",
  "HELIUS_API_URL",
  "CUSTOM_SOLANA_RPC_URL",
  "ALLOWED_ORIGINS",
]) {
  if (!new RegExp(`^${key}=`, "m").test(backend)) {
    failures.push(`backend environment missing ${key}`);
  }
}

if (!/^NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta$/m.test(frontend)) {
  failures.push("frontend default cluster must be mainnet-beta");
}
if (
  !/^NEXT_PUBLIC_SOLANA_RPC_URL=http:\/\/localhost:3001\/api\/v1\/solana\/rpc$/m.test(
    frontend,
  )
) {
  failures.push("frontend local RPC must use backend proxy");
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  defaultCluster: "mainnet-beta",
  rpcProxy: "/api/v1/solana/rpc",
  failures,
}, null, 2));

if (failures.length) process.exit(1);
