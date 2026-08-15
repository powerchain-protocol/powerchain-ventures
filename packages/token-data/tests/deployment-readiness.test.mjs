import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_CACHE_POLICY,
  POWERCHAIN_CAPABILITIES,
  publicCacheControl,
  retryDelayWithJitterMs,
} from "../dist/index.js";

test("capability contract stays conservative for native signing", () => {
  assert.equal(POWERCHAIN_CAPABILITIES.release, "1.0.0");
  assert.equal(POWERCHAIN_CAPABILITIES.nativeSigning, false);
  assert.equal(POWERCHAIN_CAPABILITIES.walletParticipation, true);
});

test("cache control serializes deterministic public policy", () => {
  assert.equal(
    publicCacheControl(60, 300, 900),
    "public, max-age=60, s-maxage=300, stale-while-revalidate=900",
  );
  assert.equal(POWERCHAIN_CACHE_POLICY.clientFreshnessMs, 300000);
});

test("retry jitter remains bounded", () => {
  const low = retryDelayWithJitterMs(1, () => 0, 250, 2000);
  const high = retryDelayWithJitterMs(1, () => 1, 250, 2000);
  assert.equal(low, 375);
  assert.equal(high, 625);
});
