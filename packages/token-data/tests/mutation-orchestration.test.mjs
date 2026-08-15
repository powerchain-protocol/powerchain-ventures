import test from "node:test";
import assert from "node:assert/strict";
import {
  assertUnsignedIntegerString,
  requestFingerprint,
} from "../dist/index.js";

test("purchase amount contract accepts canonical integer strings", () => {
  assert.doesNotThrow(() => assertUnsignedIntegerString("amountBaseUnits", "1000000000"));
  assert.throws(() => assertUnsignedIntegerString("amountBaseUnits", "1.5"));
  assert.throws(() => assertUnsignedIntegerString("amountBaseUnits", "-1"));
});

test("mutation fingerprint is stable across object key ordering", async () => {
  const first = await requestFingerprint("POST", "/api/v1/purchase", {
    saleId: "sale-1",
    amountBaseUnits: "100",
  });
  const second = await requestFingerprint("POST", "/api/v1/purchase", {
    amountBaseUnits: "100",
    saleId: "sale-1",
  });
  assert.equal(first, second);
});
