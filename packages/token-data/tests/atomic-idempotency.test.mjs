import test from "node:test";
import assert from "node:assert/strict";
import {
  requestFingerprint,
  normalizeIdempotencyKey,
} from "../dist/index.js";

test("atomic reservation fingerprint stays deterministic", async () => {
  const first = await requestFingerprint("POST", "/api/v1/purchase", {
    quoteId: "q-1",
    amountBaseUnits: "1000",
  });
  const second = await requestFingerprint("POST", "/api/v1/purchase", {
    amountBaseUnits: "1000",
    quoteId: "q-1",
  });
  assert.equal(first, second);
  assert.equal(first.length, 64);
});

test("atomic idempotency key remains strict", () => {
  assert.equal(normalizeIdempotencyKey("purchase-abcdef12"), "purchase-abcdef12");
  assert.equal(normalizeIdempotencyKey("bad key with spaces"), null);
});
