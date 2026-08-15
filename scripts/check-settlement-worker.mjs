import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const failures = [];
const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

for (const rel of [
  "apps/backend/lib/settlement/reconciliation-worker.ts",
  "apps/backend/lib/settlement/rpc-adapter.ts",
  "apps/backend/app/api/v1/runtime/settlements/reconcile/route.ts",
  "apps/backend/app/api/v1/settlements/[settlementId]/route.ts",
  "apps/checkout/components/purchase-flow.tsx",
]) {
  if (
    !fs.existsSync(
      path.join(root, rel),
    )
  ) {
    failures.push(
      `missing ${rel}`,
    );
  }
}

const worker =
  read(
    "apps/backend/lib/settlement/reconciliation-worker.ts",
  );

for (const guard of [
  "recoverExpiredLeases",
  "settlement.observe",
  "RECONCILIATION_BOUNDS_EXHAUSTED",
  '"reconciled"',
]) {
  if (
    !worker.includes(guard)
  ) {
    failures.push(
      `settlement worker missing ${guard}`,
    );
  }
}

const confirm =
  read(
    "apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts",
  );

for (const guard of [
  "registerSubmittedSettlement",
  "settlementId",
  "settlementState",
]) {
  if (
    !confirm.includes(guard)
  ) {
    failures.push(
      `purchase confirmation missing ${guard}`,
    );
  }
}

const checkout =
  read(
    "apps/checkout/components/purchase-flow.tsx",
  );

for (const guard of [
  "waitForReconciledSettlement",
  '"reconciled"',
  "has not been resubmitted",
  "will not resubmit it automatically",
]) {
  if (
    !checkout.includes(guard)
  ) {
    failures.push(
      `checkout finality guard missing ${guard}`,
    );
  }
}

const vercel =
  JSON.parse(
    read(
      "apps/backend/vercel.json",
    ),
  );

if (
  !vercel.crons?.some(
    cron =>
      cron.path ===
      "/api/v1/runtime/settlements/reconcile" &&
      cron.schedule ===
      "* * * * *",
  )
) {
  failures.push(
    "settlement reconciliation cron is missing or not minutely",
  );
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) {
  process.exit(1);
}
