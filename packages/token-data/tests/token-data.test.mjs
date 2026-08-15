import test from "node:test";
import assert from "node:assert/strict";
import {
  PWRC_TOKEN,
  POWERCHAIN_FEE_POLICY,
  PWRC_PUBLIC_DATA,
  assertPwrcPublicPayload,
  assertPwrcSupplyInvariant,
  isSaleActive,
  saleRemainingBaseUnits,
} from "../dist/index.js";

test("canonical PWRC protocol data is exact", () => {
  assert.equal(assertPwrcSupplyInvariant(), true);
  assert.equal(assertPwrcPublicPayload(PWRC_PUBLIC_DATA), true);
  assert.equal(PWRC_TOKEN.decimals, 9);
  assert.equal(PWRC_TOKEN.totalSupplyTokens, "18446000000");
  assert.equal(PWRC_TOKEN.totalSupplyBaseUnits, "18446000000000000000");
  assert.equal(PWRC_TOKEN.mintAddress, null);
});

test("fee policy differentiates purchase from non-purchase actions", () => {
  assert.equal(POWERCHAIN_FEE_POLICY.purchaseServiceFeeBps, 250);
  assert.equal(POWERCHAIN_FEE_POLICY.claimServiceFeeBps, 0);
  assert.equal(POWERCHAIN_FEE_POLICY.walletTransferServiceFeeBps, 0);
  assert.equal(POWERCHAIN_FEE_POLICY.creatorLifecycleServiceFeeBps, 0);
});

test("sale data helpers fail closed and use bigint", () => {
  const now = Date.parse("2026-08-15T10:00:00Z");
  assert.equal(isSaleActive({ status:"active", startsAt:"2026-08-15T09:00:00Z", endsAt:"2026-08-15T11:00:00Z" }, now), true);
  assert.equal(isSaleActive({ status:"active", startsAt:null, endsAt:null }, now), false);
  assert.equal(saleRemainingBaseUnits({ allocationBaseUnits:"100", soldBaseUnits:"30" }), 70n);
});
