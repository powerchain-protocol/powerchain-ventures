import test from "node:test";
import assert from "node:assert/strict";
import {
  canonicalJson,
  normalizeIdempotencyKey,
  requestFingerprint,
} from "../dist/index.js";

test("canonical JSON is stable across key ordering", () => {
  assert.equal(
    canonicalJson({ b: 2, a: 1 }),
    canonicalJson({ a: 1, b: 2 }),
  );
});

test("request fingerprints distinguish route and payload", async () => {
  const first = await requestFingerprint("POST", "/api/v1/a", { amount: "10" });
  const second = await requestFingerprint("POST", "/api/v1/b", { amount: "10" });
  const third = await requestFingerprint("POST", "/api/v1/a", { amount: "11" });
  assert.notEqual(first, second);
  assert.notEqual(first, third);
  assert.equal(first.length, 64);
});

test("idempotency key remains normalized", () => {
  assert.equal(normalizeIdempotencyKey("purchase-12345678"), "purchase-12345678");
});
