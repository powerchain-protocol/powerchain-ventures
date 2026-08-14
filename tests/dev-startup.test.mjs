import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const json = (file) => JSON.parse(read(file));

test("Next apps load monorepo-root env with the official Next env loader", () => {
  for (const app of ["frontend", "backend"]) {
    const config = read(`apps/${app}/next.config.ts`);
    assert.match(config, /loadEnvConfig/);
    assert.match(config, /fileURLToPath\(import\.meta\.url\)/);
    assert.doesNotMatch(config, /path\.resolve\(process\.cwd\(\),\s*["']\.\.\/\.\.["']\)/);

    const pkg = json(`apps/${app}/package.json`);
    assert.equal(pkg.devDependencies["@next/env"], "16.2.12");
    assert.match(pkg.scripts.predev, /check-dev-start\.mjs/);
    assert.match(pkg.scripts.predev, /build:packages/);
  }
});

test("frontend startup keeps fixed ports and direct diagnostics", () => {
  const checker = read("scripts/check-dev-start.mjs");
  assert.match(checker, /frontend:[\s\S]*port: 3000/);
  assert.match(checker, /backend:[\s\S]*port: 3001/);
  assert.match(checker, /Node 24 is required/);
  assert.match(checker, /EADDRINUSE/);
  assert.match(checker, /lsof -nP -iTCP:/);

  const root = json("package.json");
  assert.equal(root.packageManager, "pnpm@11.21.0");
  assert.equal(root.scripts["dev:frontend:direct"], "pnpm -C apps/frontend exec next dev --port 3000");
  assert.equal(root.scripts["clean:frontend"], "node scripts/clean-next-cache.mjs frontend");
});

test("test and validate build generated workspace outputs before dist imports", () => {
  const root = json("package.json");
  assert.match(root.scripts.test, /^pnpm build:packages && node --test/);
  assert.match(root.scripts.validate, /sync-openapi\.mjs --check && pnpm build:packages && node --test/);
});
