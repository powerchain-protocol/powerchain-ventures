import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  ".env.example",
  ".env.local",
  "apps/frontend/.env.example",
  "apps/frontend/.env.local",
  "apps/backend/.env.example",
  "apps/backend/.env.local",
  "apps/mobile/.env.example",
  "apps/mobile/.env.local",
];

let failed = false;
for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) {
    console.error(`[PowerChain] Missing environment file: ${relative}`);
    failed = true;
  }
}

const frontend = fs.readFileSync(path.join(root, "apps/frontend/.env.example"), "utf8");
for (const key of ["NEXT_PUBLIC_APP_URL", "BACKEND_ORIGIN", "NEXT_PUBLIC_SOLANA_CLUSTER", "NEXT_PUBLIC_SOLANA_RPC_URL"]) {
  if (!new RegExp(`^${key}=`, "m").test(frontend)) {
    console.error(`[PowerChain] Frontend env example is missing ${key}`);
    failed = true;
  }
}
for (const forbidden of ["SUPABASE_SERVICE_ROLE_KEY", "HELIUS_API_KEY", "BIRDEYE_API_KEY", "POWERCHAIN_TRANSACTION_BUILDER_API_KEY"]) {
  if (new RegExp(`^${forbidden}=`, "m").test(frontend)) {
    console.error(`[PowerChain] Frontend env must not expose ${forbidden}`);
    failed = true;
  }
}

const backend = fs.readFileSync(path.join(root, "apps/backend/.env.example"), "utf8");
for (const key of ["ALLOWED_ORIGINS", "SOLANA_RPC_URL", "POWERCHAIN_TREASURY_WALLET"]) {
  if (!new RegExp(`^${key}=`, "m").test(backend)) {
    console.error(`[PowerChain] Backend env example is missing ${key}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("[PowerChain] root/frontend/backend/mobile env files are present and separated correctly.");
