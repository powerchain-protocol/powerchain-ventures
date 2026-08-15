import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/backend/lib/settlement/service.ts",
  "apps/backend/lib/settlement/solana-observer.ts",
  "apps/backend/lib/settlement/reconciliation-worker.ts",
  "apps/backend/lib/runtime-persistence/settlements.ts",
  "apps/backend/lib/runtime-persistence/outbox.ts",
  "database/migrations/033_settlement_finality.sql",
]) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`missing ${rel}`);
}

const shared = fs.readFileSync(path.join(root, "packages/token-data/src/settlement.ts"), "utf8");
if (!shared.includes('"finalized"')) failures.push("settlement contract missing finalized state");
if (!shared.includes('"reconciled"')) failures.push("settlement contract missing reconciled state");

const worker = fs.readFileSync(
  path.join(root, "apps/backend/lib/settlement/reconciliation-worker.ts"),
  "utf8",
);
if (!worker.includes("observeSolanaTransaction")) failures.push("reconciliation worker does not observe Solana");
if (!worker.includes('nextState: "reconciled"')) failures.push("reconciliation worker does not require reconciled state");

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));
if (failures.length) process.exit(1);
