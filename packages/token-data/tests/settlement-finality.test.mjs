import test from "node:test";
import assert from "node:assert/strict";
import {
  canTransitionSettlement,
  decideReconciliation,
  settlementStateFromObservation,
} from "../dist/index.js";

test("settlement cannot skip directly from created to reconciled", () => {
  assert.equal(canTransitionSettlement("created", "reconciled"), false);
  assert.equal(canTransitionSettlement("created", "submitted"), true);
});

test("finalized chain observation maps to finalized settlement", () => {
  assert.equal(settlementStateFromObservation("finalized"), "finalized");
});

test("reconciliation completes only after finality", () => {
  assert.equal(decideReconciliation({
    settlementState: "confirmed",
    observationState: "confirmed",
    attempts: 5,
    maxAttempts: 120,
    ageMs: 30_000,
    maxAgeMs: 900_000,
  }).decision, "wait");

  assert.equal(decideReconciliation({
    settlementState: "finalized",
    observationState: "finalized",
    attempts: 6,
    maxAttempts: 120,
    ageMs: 35_000,
    maxAgeMs: 900_000,
  }).decision, "finalize");
});

test("bounded reconciliation escalates instead of retrying forever", () => {
  assert.equal(decideReconciliation({
    settlementState: "submitted",
    observationState: "not-found",
    attempts: 120,
    maxAttempts: 120,
    ageMs: 100_000,
    maxAgeMs: 900_000,
  }).decision, "manual-review");
});
