import {
  assertPwrcPublicPayload,
  hasSupportedPublicDataSchema,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "./index.js";

export function assertPowerChainPublicRegistryEnvelope(
  value: unknown,
): asserts value is PublicDataEnvelope<PowerChainPublicRegistry> {
  if (!hasSupportedPublicDataSchema(value)) {
    throw new Error("Unsupported PowerChain public-data schema");
  }

  const envelope = value as Partial<PublicDataEnvelope<PowerChainPublicRegistry>>;
  if (envelope.kind !== "powerchain-public-registry") {
    throw new Error("Unexpected PowerChain public-data kind");
  }
  if (!envelope.data || typeof envelope.data !== "object") {
    throw new Error("Missing PowerChain public-data registry");
  }
  if (envelope.data.release !== "1.0.0") {
    throw new Error(`Unsupported PowerChain release ${String(envelope.data.release)}`);
  }
  if (!envelope.data.tokens?.PWRC) {
    throw new Error("PWRC token data missing from registry");
  }
  assertPwrcPublicPayload(envelope.data.tokens.PWRC);
}
