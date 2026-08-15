import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/frontend/tsconfig.json",
  "apps/backend/tsconfig.json",
  "apps/checkout/tsconfig.json",
]) {
  const file = path.join(root, rel);
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  const paths = config.compilerOptions?.paths ?? {};

  for (const [alias, targets] of Object.entries(paths)) {
    for (const target of targets) {
      if (/\.d\.ts$/i.test(target)) {
        failures.push(`${rel}: runtime alias ${alias} points to declaration file ${target}`);
      }
    }
  }
}

const helper = fs.readFileSync(
  path.join(root, "apps/frontend/lib/helpers.ts"),
  "utf8",
);
if (!helper.includes('from "@powerchain/utils/http"')) {
  failures.push("frontend helper must import HTTP runtime from @powerchain/utils/http");
}
if (!helper.includes("fetchJsonWithPolicy<T>")) {
  failures.push("frontend fetchJson wrapper is not wired to fetchJsonWithPolicy");
}

const safeActions = fs.readFileSync(
  path.join(root, "apps/frontend/lib/safe-actions.ts"),
  "utf8",
);
const safePostCall = safeActions.match(/fetchJsonWithPolicy<[^>]+>\(([\s\S]*?)\);/);
if (!safePostCall) {
  failures.push("safePost is not calling fetchJsonWithPolicy");
} else {
  const callText = safePostCall[1];
  const topLevelObjectCount = (callText.match(/\},\s*\{/g) ?? []).length;
  if (topLevelObjectCount > 0) {
    failures.push("safePost still calls fetchJsonWithPolicy with an unsupported third argument");
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
