import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/mutation-orchestrator.ts",
  "apps/backend/lib/mutations/purchase.ts",
  "apps/backend/lib/mutations/claim.ts",
  "apps/backend/lib/mutations/creator.ts",
  "apps/backend/lib/runtime-persistence/mutation-receipts.ts",
  "apps/backend/app/api/v1/mutations/[mutationId]/route.ts",
  "database/migrations/030_runtime_mutation_receipts.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const migration = fs.existsSync(path.join(root, "database/migrations/030_runtime_mutation_receipts.sql"))
  ? fs.readFileSync(path.join(root, "database/migrations/030_runtime_mutation_receipts.sql"), "utf8")
  : "";

if (!migration.includes("powerchain_runtime_mutation_receipts")) {
  failures.push("mutation receipt table missing");
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
