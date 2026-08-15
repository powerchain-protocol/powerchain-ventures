import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_SECURITY_POLICY,
  POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS,
} from "../dist/index.js";

test("security policy forbids credentials on public API", () => {
  assert.equal(POWERCHAIN_SECURITY_POLICY.publicApi.credentials, false);
  assert.equal(POWERCHAIN_SECURITY_POLICY.publicApi.cors, "same-origin");
  assert.equal(POWERCHAIN_SECURITY_POLICY.headers.contentTypeOptions, "nosniff");
});

test("public runtime defaults expose no deployment secrets", () => {
  assert.equal(POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS.release, "1.0.0");
  assert.equal(POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS.network, "solana-mainnet-beta");
  assert.equal(POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS.tokenSymbol, "PWRC");
  assert.equal("rpcUrl" in POWERCHAIN_PUBLIC_RUNTIME_DEFAULTS, false);
});
