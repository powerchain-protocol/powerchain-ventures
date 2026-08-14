import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const reconcile=fs.readFileSync("apps/backend/app/api/v1/launchpad/reconcile/route.ts","utf8");
const ops=fs.readFileSync("apps/backend/app/api/v1/launchpad/ops/status/route.ts","utf8");
const migration=fs.readFileSync("database/migrations/021_reconciliation_leases_and_ops.sql","utf8");
const vercel=JSON.parse(fs.readFileSync("apps/backend/vercel.json","utf8"));

test("reconciliation is lease-protected and supports Vercel GET cron",()=>{
 assert.match(reconcile,/acquireOperationLease/);
 assert.match(reconcile,/releaseOperationLease/);
 assert.match(reconcile,/export const GET=run/);
 assert.match(reconcile,/export const POST=run/);
});

test("operation lease is service-role protected",()=>{
 assert.match(migration,/launchpad_acquire_operation_lease/);
 assert.match(migration,/security definer/);
 assert.match(migration,/grant execute.*service_role/s);
 assert.match(migration,/revoke all.*public/s);
});

test("operations status is secret protected and exposes no review plan",()=>{
 assert.match(ops,/reconciliationAuthorized/);
 assert.doesNotMatch(ops,/serializedTransaction|\bplan\b/);
 assert.match(ops,/retriesDue/);
});

test("Vercel schedules reconciliation every five minutes",()=>{
 assert.ok(vercel.crons?.some(c=>c.path==="/api/v1/launchpad/reconcile"&&c.schedule==="*/5 * * * *"));
});
