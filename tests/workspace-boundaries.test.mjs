import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("canonical monorepo applications exist without payload layer", () => {
  for (
    const app
    of [
      "frontend",
      "backend",
      "checkout",
      "mobile",
    ]
  ) {
    assert.equal(
      fs.existsSync(
        `apps/${app}/package.json`,
      ),
      true,
      app,
    );
  }

  assert.equal(
    fs.existsSync(
      "apps/payload",
    ),
    false,
  );
  assert.equal(
    fs.existsSync(
      "payload",
    ),
    false,
  );
});

test("workspace boundary doctor is installed", () => {
  const source =
    fs.readFileSync(
      "scripts/check-workspace-boundaries.mjs",
      "utf8",
    );

  assert.match(
    source,
    /use a workspace package or API boundary/,
  );
  assert.match(
    source,
    /imports application internals/,
  );
});
