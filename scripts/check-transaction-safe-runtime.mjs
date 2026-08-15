import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/mutation-executor.ts",
  "apps/backend/lib/mutation-response.ts",
  "apps/backend/lib/runtime-persistence/configure.ts",
  "apps/backend/lib/runtime-persistence/health.ts",
  "apps/backend/lib/runtime-persistence/cleanup.ts",
  "apps/backend/app/api/v1/runtime/persistence/health/route.ts",
  "database/migrations/028_runtime_protection.sql",
  "database/migrations/029_runtime_protection_cleanup.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const executor = fs.existsSync(path.join(root, "apps/backend/lib/mutation-executor.ts"))
  ? fs.readFileSync(path.join(root, "apps/backend/lib/mutation-executor.ts"), "utf8")
  : "";

for (const required of [
  "normalizeIdempotencyKey",
  "requestFingerprint",
  "idempotency.read",
  "idempotency.create",
]) {
  if (!executor.includes(required)) failures.push(`mutation executor missing ${required}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
