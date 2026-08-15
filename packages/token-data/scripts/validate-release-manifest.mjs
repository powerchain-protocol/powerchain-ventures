import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/release-manifest.json"), "utf8"));

const errors = [];
if (manifest.release !== "1.0.0") errors.push("release must remain 1.0.0");
if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1");
for (const rel of Object.values(manifest.artifacts ?? {})) {
  const normalized = String(rel).replace(/^packages\/token-data\//, "");
  if (!fs.existsSync(path.join(root, normalized))) errors.push(`missing artifact ${rel}`);
}
if (!Array.isArray(manifest.checks) || !manifest.checks.includes("build")) errors.push("release checks must include build");

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, release:manifest.release, checks:manifest.checks.length }, null, 2));
