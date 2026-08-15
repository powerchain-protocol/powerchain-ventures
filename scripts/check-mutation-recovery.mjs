import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/runtime-persistence/mutation-leases.ts",
  "apps/backend/lib/mutation-recovery.ts",
  "apps/backend/app/api/v1/runtime/mutations/[mutationId]/recovery/route.ts",
  "database/migrations/032_mutation_leases.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const orchestrator = fs.existsSync(path.join(root, "apps/backend/lib/mutation-orchestrator.ts"))
  ? fs.readFileSync(path.join(root, "apps/backend/lib/mutation-orchestrator.ts"), "utf8")
  : "";

for (const required of [
  "mutationLeases.acquire",
  "mutationLeases.heartbeat",
  "mutationLeases.complete",
  "mutationLeases.fail",
  "POWERCHAIN_MUTATION_LEASE.maxAttempts",
]) {
  if (!orchestrator.includes(required)) failures.push(`orchestrator missing ${required}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
