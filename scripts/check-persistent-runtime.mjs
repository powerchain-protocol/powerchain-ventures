import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/runtime-persistence/index.ts",
  "apps/backend/lib/runtime-persistence/memory.ts",
  "apps/backend/lib/runtime-persistence/prisma.ts",
  "apps/backend/lib/shared-rate-limit.ts",
  "apps/backend/lib/persistent-idempotency.ts",
  "apps/backend/lib/audit-log.ts",
  "database/migrations/028_runtime_protection.sql",
  "database/migrations/029_runtime_protection_cleanup.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const migration = fs.existsSync(path.join(root, "database/migrations/028_runtime_protection.sql"))
  ? fs.readFileSync(path.join(root, "database/migrations/028_runtime_protection.sql"), "utf8")
  : "";

for (const table of [
  "powerchain_runtime_rate_limits",
  "powerchain_runtime_idempotency",
  "powerchain_runtime_audit",
]) {
  if (!migration.includes(table)) failures.push(`migration missing ${table}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
