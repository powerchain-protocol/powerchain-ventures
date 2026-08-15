import test from "node:test";
import assert from "node:assert/strict";
import {
  requestFingerprint,
  normalizeIdempotencyKey,
} from "../dist/index.js";

test("same logical body yields same mutation fingerprint", async () => {
  const a = await requestFingerprint("POST", "/api/v1/purchase", {
    wallet: "abc",
    amount: "1000000000",
  });
  const b = await requestFingerprint("POST", "/api/v1/purchase", {
    amount: "1000000000",
    wallet: "abc",
  });
  assert.equal(a, b);
});

test("different method yields different mutation fingerprint", async () => {
  const body = { id: "sale-1" };
  const a = await requestFingerprint("POST", "/api/v1/sale", body);
  const b = await requestFingerprint("PATCH", "/api/v1/sale", body);
  assert.notEqual(a, b);
});

test("mutation idempotency key format remains strict", () => {
  assert.equal(normalizeIdempotencyKey("claim-12345678"), "claim-12345678");
  assert.equal(normalizeIdempotencyKey("bad key"), null);
});
