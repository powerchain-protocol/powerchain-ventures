import test from "node:test";
import assert from "node:assert/strict";
import {
  PublicDataCircuitBreaker,
  retryDelayMs,
} from "../dist/index.js";

test("circuit breaker opens after threshold and recovers half-open", () => {
  const breaker = new PublicDataCircuitBreaker(2, 1000);
  breaker.failure(100);
  assert.equal(breaker.snapshot().state, "closed");
  breaker.failure(200);
  assert.equal(breaker.snapshot().state, "open");
  assert.equal(breaker.canRequest(500), false);
  assert.equal(breaker.canRequest(1200), true);
  assert.equal(breaker.snapshot().state, "half-open");
  breaker.success();
  assert.equal(breaker.snapshot().state, "closed");
});

test("retry delay is bounded", () => {
  assert.equal(retryDelayMs(0, 250, 2000), 250);
  assert.equal(retryDelayMs(1, 250, 2000), 500);
  assert.equal(retryDelayMs(10, 250, 2000), 2000);
});
