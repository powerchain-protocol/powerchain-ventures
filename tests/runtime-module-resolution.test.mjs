import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("Next app runtime aliases never target declaration files", () => {
  for (const rel of [
    "apps/frontend/tsconfig.json",
    "apps/backend/tsconfig.json",
  ]) {
    const config = JSON.parse(
      fs.readFileSync(path.join(root, rel), "utf8"),
    );
    const paths = config.compilerOptions?.paths ?? {};

    for (const [alias, targets] of Object.entries(paths)) {
      for (const target of targets) {
        assert.doesNotMatch(
          target,
          /\.d\.ts$/i,
          `${rel}: ${alias} must not target ${target}`,
        );
      }
    }
  }
});

test("frontend fetchJson imports executable workspace module", () => {
  const source = fs.readFileSync(
    path.join(root, "apps/frontend/lib/helpers.ts"),
    "utf8",
  );
  assert.match(source, /from "@powerchain\/utils\/http"/);
  assert.match(source, /fetchJsonWithPolicy<T>/);
});

test("safePost passes idempotency policy in the options object", () => {
  const source = fs.readFileSync(
    path.join(root, "apps/frontend/lib/safe-actions.ts"),
    "utf8",
  );
  assert.match(source, /idempotencyKey,/);
  assert.match(source, /retries: 1/);
});

test("Prisma config can load without DATABASE_URL for client generation", () => {
  const source = fs.readFileSync(
    path.join(root, "prisma.config.ts"),
    "utf8",
  );
  assert.match(source, /process\.env\.DATABASE_URL/);
  assert.match(source, /127\.0\.0\.1:5432\/powerchain/);
});
