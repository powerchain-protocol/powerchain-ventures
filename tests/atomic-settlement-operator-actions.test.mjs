import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = rel =>
  fs.readFileSync(
    rel,
    "utf8",
  );

test("database settlement registration is atomic and transaction-backed", () => {
  const source =
    read(
      "apps/backend/lib/runtime-persistence/settlement-registration.ts",
    );

  assert.match(
    source,
    /\$transaction/,
  );
  assert.match(
    source,
    /FOR UPDATE/,
  );
  assert.match(
    source,
    /INSERT INTO powerchain_runtime_settlements/,
  );
  assert.match(
    source,
    /INSERT INTO powerchain_runtime_outbox/,
  );
});

test("failed observation event can be revived but completed event is not replayed", () => {
  const database =
    read(
      "apps/backend/lib/runtime-persistence/settlement-registration.ts",
    );
  const memory =
    read(
      "apps/backend/lib/runtime-persistence/memory.ts",
    );

  assert.match(
    database,
    /WHERE[\s\S]*powerchain_runtime_outbox\.state='failed'/,
  );
  assert.doesNotMatch(
    database,
    /WHERE[\s\S]*powerchain_runtime_outbox\.state='completed'[\s\S]*state='pending'/,
  );
  assert.match(
    memory,
    /existingEvent\.state ===\s*"failed"/,
  );
});

test("runtime health is read-only for rate-limit and audit persistence", () => {
  const health =
    read(
      "apps/backend/lib/runtime-persistence/health.ts",
    );

  assert.match(
    health,
    /rateLimit\.health\(\)/,
  );
  assert.match(
    health,
    /audit\.health\(\)/,
  );
  assert.doesNotMatch(
    health,
    /rateLimit\.consume/,
  );
  assert.doesNotMatch(
    health,
    /audit\.append/,
  );
});

test("manual-review operator action never resubmits a transaction", () => {
  const route =
    read(
      "apps/backend/app/api/v1/runtime/settlements/[settlementId]/action/route.ts",
    );

  assert.match(
    route,
    /retry-observation/,
  );
  assert.match(
    route,
    /registerSubmittedSettlement/,
  );
  assert.match(
    route,
    /Only manual-review settlements accept operator actions/,
  );
  assert.doesNotMatch(
    route,
    /sendRawTransaction|sendTransaction|signAndSend/,
  );
});

test("manual-review operator action requires a reason and writes runtime audit", () => {
  const route =
    read(
      "apps/backend/app/api/v1/runtime/settlements/[settlementId]/action/route.ts",
    );

  assert.match(
    route,
    /Operator reason is required/,
  );
  assert.match(
    route,
    /settlement_operator_retry/,
  );
  assert.match(
    route,
    /settlement_operator_fail/,
  );
});

test("program parity doctor covers canonical on-chain identities", () => {
  const doctor =
    read(
      "scripts/check-program-parity.mjs",
    );

  assert.match(
    doctor,
    /SERVICE_FEE_BPS: u64 = 250/,
  );
  assert.match(
    doctor,
    /canonical fee wallet mismatch/,
  );
  assert.match(
    doctor,
    /on-chain account invariant missing/,
  );
});
