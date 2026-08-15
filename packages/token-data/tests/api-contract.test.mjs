import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_PUBLIC_REGISTRY,
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
  POWERCHAIN_PUBLIC_DATA_PROVENANCE,
} from "../dist/index.js";

test("public-data API contract remains release 1.0.0/schema 1", () => {
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.release, "1.0.0");
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE.schemaVersion, 1);
  assert.equal(POWERCHAIN_PUBLIC_DATA_PROVENANCE.release, "1.0.0");
  assert.equal(POWERCHAIN_PUBLIC_DATA_PROVENANCE.schemaVersion, 1);
});

test("registry contains canonical PWRC only once", () => {
  const symbols = Object.keys(POWERCHAIN_PUBLIC_REGISTRY.tokens);
  assert.deepEqual(symbols, ["PWRC"]);
  assert.equal(POWERCHAIN_PUBLIC_REGISTRY.tokens.PWRC.token.symbol, "PWRC");
});
