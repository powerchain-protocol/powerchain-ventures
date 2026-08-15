import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_MUTATION_LEASE,
  decideMutationRecovery,
} from "../dist/index.js";

test("expired processing mutation can be taken over", () => {
  const decision = decideMutationRecovery({
    state: "processing",
    leaseExpired: true,
    attempt: 1,
    maxAttempts: 3,
    hasReceipt: false,
  });
  assert.equal(decision.action, "takeover");
});

test("recovery fails closed after maximum attempts", () => {
  const decision = decideMutationRecovery({
    state: "processing",
    leaseExpired: true,
    attempt: 3,
    maxAttempts: 3,
    hasReceipt: false,
  });
  assert.equal(decision.action, "mark-failed");
});

test("mutation lease timing is bounded", () => {
  assert.equal(POWERCHAIN_MUTATION_LEASE.leaseMs, 30000);
  assert.equal(POWERCHAIN_MUTATION_LEASE.heartbeatMs, 10000);
  assert.equal(POWERCHAIN_MUTATION_LEASE.maxAttempts, 3);
});
