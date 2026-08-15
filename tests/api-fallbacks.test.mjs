import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel =>
  fs.readFileSync(path.join(root, rel), "utf8");

test("network status uses shared formats and transport health", () => {
  const source = read(
    "apps/frontend/components/launchpad/network-status.tsx",
  );
  assert.match(
    source,
    /@powerchain\/utils\/formats/,
  );
  assert.match(
    source,
    /useTransportStatus/,
  );
  assert.doesNotMatch(
    source,
    /toLocaleString/,
  );
});

test("auth and contact services use endpoint registry", () => {
  for (const rel of [
    "apps/frontend/services/auth-service.ts",
    "apps/frontend/services/contact-service.ts",
  ]) {
    assert.match(read(rel), /API_ENDPOINTS/);
  }
});
