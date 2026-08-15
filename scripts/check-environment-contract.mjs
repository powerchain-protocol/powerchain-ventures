import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function parse(file) {
  const out = new Map();
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index <= 0) continue;
    out.set(trimmed.slice(0, index).trim(), trimmed.slice(index + 1));
  }
  return out;
}

const rootEnv = parse(path.join(root, ".env.example"));
const mobileEnv = parse(path.join(root, "apps/mobile/.env.example"));

for (const key of ["SOLANA_RPC_URL"]) {
  if (!rootEnv.has(key)) warnings.push(`root .env.example missing ${key}`);
}

for (const key of [
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_WEB_URL",
]) {
  if (!mobileEnv.has(key)) warnings.push(`mobile .env.example missing ${key}`);
}

const forbiddenMobile = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "HELIUS_API_KEY",
  "BIRDEYE_API_KEY",
  "CDP_API_KEY_SECRET",
  "PRIVATE_KEY",
  "SEED_PHRASE",
  "POWERCHAIN_QUOTE_AUTHORITY_PRIVATE_KEY",
];

for (const key of forbiddenMobile) {
  if (mobileEnv.has(key)) failures.push(`mobile env must not expose ${key}`);
}

for (const key of mobileEnv.keys()) {
  if (!key.startsWith("EXPO_PUBLIC_")) {
    warnings.push(`mobile env key ${key} is not EXPO_PUBLIC_*; verify it is safe for native bundling`);
  }
}

for (const key of rootEnv.keys()) {
  if (key.startsWith("EXPO_PUBLIC_")) {
    warnings.push(`root .env.example contains mobile-specific key ${key}`);
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
  warnings,
}, null, 2));
if (failures.length) process.exit(1);
