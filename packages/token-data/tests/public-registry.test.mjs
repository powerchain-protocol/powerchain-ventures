import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_PUBLIC_REGISTRY,
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
} from "../dist/index.js";

test("public registry exposes one canonical PWRC profile", () => {
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.release, "1.0.0");
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.chain, "solana");
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.cluster, "mainnet-beta");
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.tokens.PWRC.token.symbol, "PWRC");
});

test("public registry envelope is schema version 1", () => {
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE.schemaVersion, 1);
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE.kind, "powerchain-public-registry");
});
