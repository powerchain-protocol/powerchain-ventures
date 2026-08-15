import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("runtime safety migrations exist in order", () => {
  const expected = [
    "028_runtime_protection.sql",
    "029_runtime_protection_cleanup.sql",
    "030_runtime_mutation_receipts.sql",
    "031_atomic_idempotency_reservations.sql",
    "032_mutation_leases.sql",
    "033_settlement_finality.sql",
  ];
  for (const name of expected) {
    assert.equal(
      fs.existsSync(path.join(root, "database/migrations", name)),
      true,
      `${name} missing`,
    );
  }
});

test("settlement migration contains durable outbox and settlement tables", () => {
  const sql = fs.readFileSync(
    path.join(root, "database/migrations/033_settlement_finality.sql"),
    "utf8",
  );
  assert.match(sql, /powerchain_runtime_settlements/);
  assert.match(sql, /powerchain_runtime_outbox/);
});
