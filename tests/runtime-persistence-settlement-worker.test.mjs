import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

test("production runtime persistence fails closed on database mode", () => {
  const source = read(
    "apps/backend/lib/runtime-persistence/mode.ts",
  );

  assert.match(
    source,
    /NODE_ENV === "production"/,
  );
  assert.match(
    source,
    /mode !== "database"/,
  );
  assert.match(
    source,
    /DATABASE_URL is required/,
  );
});

test("Prisma 7 runtime client uses the PostgreSQL driver adapter", () => {
  const source = read(
    "apps/backend/lib/runtime-persistence/client.ts",
  );

  assert.match(
    source,
    /@prisma\/adapter-pg/,
  );
  assert.match(
    source,
    /new PrismaPg/,
  );
  assert.match(
    source,
    /generated\/prisma\/client/,
  );
});

test("runtime bootstrap checks settlement and outbox schema before activation", () => {
  const source = read(
    "apps/backend/lib/runtime-persistence/schema.ts",
  );

  assert.match(
    source,
    /powerchain_runtime_settlements/,
  );
  assert.match(
    source,
    /powerchain_runtime_outbox/,
  );
  assert.match(
    source,
    /last_error/,
  );
  assert.match(
    source,
    /failed_at/,
  );
});

test("outbox worker recovers leases and only completes after finalization reconciliation", () => {
  const worker = read(
    "apps/backend/lib/settlement/reconciliation-worker.ts",
  );

  assert.match(
    worker,
    /recoverExpiredLeases/,
  );
  assert.match(
    worker,
    /expectedState:\s*"finalized"[\s\S]*nextState:\s*"reconciled"/,
  );
  assert.match(
    worker,
    /RECONCILIATION_BOUNDS_EXHAUSTED/,
  );
});

test("purchase confirmation creates a durable settlement identity", () => {
  const confirm = read(
    "apps/backend/app/api/v1/launchpad/purchase/confirm/route.ts",
  );

  assert.match(
    confirm,
    /registerSubmittedSettlement/,
  );
  assert.match(
    confirm,
    /mutationId:`purchase:\$\{reviewId\}`/,
  );
  assert.match(
    confirm,
    /settlementId/,
  );
});

test("checkout success is gated by reconciled settlement state", () => {
  const flow = read(
    "apps/checkout/components/purchase-flow.tsx",
  );

  assert.match(
    flow,
    /waitForReconciledSettlement/,
  );
  assert.match(
    flow,
    /settlement\.state ===\s*"reconciled"/,
  );
  assert.match(
    flow,
    /It has not been resubmitted/,
  );
});

test("Vercel runs the settlement finality worker every minute", () => {
  const vercel =
    JSON.parse(
      read(
        "apps/backend/vercel.json",
      ),
    );

  assert.equal(
    vercel.crons.some(
      cron =>
        cron.path ===
        "/api/v1/runtime/settlements/reconcile" &&
        cron.schedule ===
        "* * * * *",
    ),
    true,
  );
});
