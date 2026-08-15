import test from "node:test";
import assert from "node:assert/strict";
import { createPowerChainProblem } from "../dist/index.js";

test("problem response contract includes request id and release", () => {
  const problem = createPowerChainProblem(
    "PUBLIC_DATA_UNAVAILABLE",
    503,
    "Service unavailable",
    "Public data is temporarily unavailable",
    "req-12345678",
  );

  assert.equal(problem.type, "about:blank");
  assert.equal(problem.status, 503);
  assert.equal(problem.code, "PUBLIC_DATA_UNAVAILABLE");
  assert.equal(problem.requestId, "req-12345678");
  assert.equal(problem.release, "1.0.0");
});
