import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function read(rel) {
  const file = path.join(root, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

const packageJson = JSON.parse(read("package.json") ?? "{}");
if (packageJson.version !== "1.0.0") failures.push("root version must remain 1.0.0");

for (const rel of [
  "apps/backend/app/api/v1/readiness/route.ts",
  "apps/backend/app/api/v1/capabilities/route.ts",
  "packages/token-data/data/public-registry.json",
  "packages/token-data/data/integrity.json",
  "packages/token-data/data/release-manifest.json",
  "packages/token-data/data/client-snapshot-manifest.json",
  "packages/token-data/data/public-api.openapi.json",
]) {
  if (!read(rel)) failures.push(`missing ${rel}`);
}

const env = read(".env.example");
if (!env) warnings.push("root .env.example missing");
else {
  if (!/SOLANA_RPC_URL=/.test(env)) warnings.push("SOLANA_RPC_URL missing from .env.example");
  if (!/POWERCHAIN_LAUNCHPAD_PROGRAM_ID=/.test(env)) warnings.push("POWERCHAIN_LAUNCHPAD_PROGRAM_ID missing from .env.example");
}

const mobileEnv = read("apps/mobile/.env.example");
if (mobileEnv && /(SERVICE_ROLE|API_KEY_SECRET|PRIVATE_KEY|SEED_PHRASE)/.test(mobileEnv)) {
  failures.push("mobile .env.example contains server-only secret-like key names");
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
  warnings,
}, null, 2));

if (failures.length) process.exit(1);
