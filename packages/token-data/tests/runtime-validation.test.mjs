import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
  assertPowerChainPublicRegistryEnvelope,
} from "../dist/index.js";

test("canonical registry passes runtime validation", () => {
  assert.doesNotThrow(() =>
    assertPowerChainPublicRegistryEnvelope(POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE)
  );
});

test("unsupported schema fails closed", () => {
  const incompatible = {
    ...POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
    schemaVersion: 2,
  };
  assert.throws(
    () => assertPowerChainPublicRegistryEnvelope(incompatible),
    /Unsupported PowerChain public-data schema/,
  );
});

test("missing PWRC profile fails closed", () => {
  const invalid = {
    ...POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE,
    data: { ...POWERCHAIN_PUBLIC_REGISTRY_ENVELOPE.data, tokens: {} },
  };
  assert.throws(
    () => assertPowerChainPublicRegistryEnvelope(invalid),
    /PWRC token data missing/,
  );
});
