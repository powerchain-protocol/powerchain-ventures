import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/runtime-persistence/atomic-idempotency.ts",
  "apps/backend/lib/runtime-persistence/mutation-receipts.ts",
  "apps/backend/lib/mutation-executor.ts",
  "apps/backend/lib/mutation-orchestrator.ts",
  "apps/backend/app/api/v1/mutations/[mutationId]/route.ts",
  "database/migrations/030_runtime_mutation_receipts.sql",
  "database/migrations/031_atomic_idempotency_reservations.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const executor = fs.existsSync(path.join(root, "apps/backend/lib/mutation-executor.ts"))
  ? fs.readFileSync(path.join(root, "apps/backend/lib/mutation-executor.ts"), "utf8")
  : "";

if (!executor.includes("atomicIdempotency.reserve")) {
  failures.push("mutation executor does not reserve idempotency atomically");
}
if (!executor.includes('kind: "in-progress"')) {
  failures.push("mutation executor does not expose in-progress state");
}

const route = fs.existsSync(path.join(root, "apps/backend/app/api/v1/mutations/[mutationId]/route.ts"))
  ? fs.readFileSync(path.join(root, "apps/backend/app/api/v1/mutations/[mutationId]/route.ts"), "utf8")
  : "";

if (route.includes("store is not configured")) {
  failures.push("mutation status route still contains fail-closed placeholder");
}
if (!route.includes("mutationReceipts.read")) {
  failures.push("mutation status route is not wired to receipt persistence");
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
