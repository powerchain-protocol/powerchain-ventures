import test from "node:test";
import assert from "node:assert/strict";
import {
  isAllowedOrigin,
  normalizeIdempotencyKey,
  createAuditEvent,
} from "../dist/index.js";

test("origin policy normalizes and rejects unrelated origins", () => {
  assert.equal(
    isAllowedOrigin("https://app.powerchain.test", ["https://app.powerchain.test/"]),
    true,
  );
  assert.equal(
    isAllowedOrigin("https://evil.example", ["https://app.powerchain.test"]),
    false,
  );
});

test("idempotency keys are bounded and validated", () => {
  assert.equal(normalizeIdempotencyKey("request-12345678"), "request-12345678");
  assert.equal(normalizeIdempotencyKey("short"), null);
  assert.equal(normalizeIdempotencyKey("x".repeat(129)), null);
});

test("audit events contain release provenance", () => {
  const event = createAuditEvent("request_rate_limited", { status: 429 });
  assert.equal(event.release, "1.0.0");
  assert.equal(event.status, 429);
});
