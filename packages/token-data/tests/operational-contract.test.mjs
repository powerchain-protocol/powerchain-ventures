import test from "node:test";
import assert from "node:assert/strict";
import {
  POWERCHAIN_PUBLIC_API,
  createPublicDataTelemetryRecord,
} from "../dist/index.js";

test("public API endpoint map stays stable for release 1.0.0", () => {
  assert.equal(POWERCHAIN_PUBLIC_API.release, "1.0.0");
  assert.equal(POWERCHAIN_PUBLIC_API.schemaVersion, 1);
  assert.equal(POWERCHAIN_PUBLIC_API.endpoints.publicData, "/api/v1/public-data");
  assert.equal(POWERCHAIN_PUBLIC_API.endpoints.version, "/api/v1/version");
});

test("telemetry records never require secret-bearing fields", () => {
  const record = createPublicDataTelemetryRecord("public_data_success", {
    status: 200,
    durationMs: 12.5,
    source: "network",
  });
  assert.equal(record.release, "1.0.0");
  assert.equal(record.schemaVersion, 1);
  assert.equal(record.event, "public_data_success");
});
