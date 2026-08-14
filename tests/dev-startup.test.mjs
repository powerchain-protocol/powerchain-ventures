import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const json = (file) => JSON.parse(read(file));

test("Next apps own app-local env files and do not require @next/env", () => {
  for (const app of ["frontend", "backend"]) {
    const config = read(`apps/${app}/next.config.ts`);
    assert.doesNotMatch(config, /@next\/env|loadEnvConfig/);
    assert.match(config, /fileURLToPath\(import\.meta\.url\)/);

    const pkg = json(`apps/${app}/package.json`);
    assert.equal(pkg.devDependencies?.["@next/env"], undefined);
    assert.match(pkg.scripts.predev, /check-dev-start\.mjs/);
    assert.match(pkg.scripts.predev, /build:packages/);

    assert.ok(fs.existsSync(new URL(`../apps/${app}/.env.example`, import.meta.url)));
    assert.ok(fs.existsSync(new URL(`../apps/${app}/.env.local`, import.meta.url)));
  }
  assert.ok(fs.existsSync(new URL("../.env.example", import.meta.url)));
  assert.ok(fs.existsSync(new URL("../.env.local", import.meta.url)));
  assert.ok(fs.existsSync(new URL("../apps/mobile/.env.local", import.meta.url)));
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
  assert.equal(root.devEngines, undefined, "devEngines.runtime must not install npm-distributed Node");
  assert.equal(root.scripts["dev:frontend:direct"], "node scripts/run-next.mjs frontend dev");
  assert.equal(root.scripts["clean:frontend"], "node scripts/clean-next-cache.mjs frontend");
  assert.equal(root.scripts.preinstall, "node scripts/check-install-runtime.mjs");
  const runner = read("scripts/run-next.mjs");
  assert.match(runner, /const args = \[nextCli, command, appDir\]/);
  assert.match(runner, /apps\/frontend/);
});

test("test and validate build generated workspace outputs before dist imports", () => {
  const root = json("package.json");
  assert.match(root.scripts.test, /^pnpm build:packages && node --test/);
  assert.match(root.scripts.validate, /sync-openapi\.mjs --check && pnpm build:packages && node --test/);
});


test("frontend development runtime has safe defaults while production stays strict", () => {
  const envFile = read("apps/frontend/.env.local");
  const parser = read("apps/frontend/lib/env/public.ts");
  const config = read("apps/frontend/next.config.ts");

  assert.match(envFile, /NEXT_PUBLIC_APP_URL=http:\/\/localhost:3000/);
  assert.match(envFile, /NEXT_PUBLIC_SOLANA_CLUSTER=devnet/);
  assert.match(envFile, /NEXT_PUBLIC_SOLANA_RPC_URL=https:\/\/api\.devnet\.solana\.com/);
  assert.match(parser, /DEVELOPMENT_DEFAULTS/);
  assert.match(parser, /if \(!isProduction\(source\)\) return DEVELOPMENT_DEFAULTS\[name\]/);
  assert.match(parser, /if \(!value\) throw new Error\(`\[PowerChain\] \$\{name\} is required`\)/);
  assert.match(config, /process\.env\.NEXT_PUBLIC_APP_URL \|\|= "http:\/\/localhost:3000"/);
  assert.match(config, /process\.env\.NEXT_PUBLIC_SOLANA_CLUSTER \|\|= "devnet"/);
});
