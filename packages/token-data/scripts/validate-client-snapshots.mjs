import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/client-snapshot-manifest.json"), "utf8"));

const errors = [];
for (const [key, value] of Object.entries({
  registry: manifest.registry,
  integrity: manifest.integrity,
})) {
  if (!value?.file || !value?.sha256) {
    errors.push(`${key} snapshot manifest entry incomplete`);
  }
}
if (manifest.release !== "1.0.0") errors.push("snapshot manifest release mismatch");
if (manifest.schemaVersion !== 1) errors.push("snapshot manifest schema mismatch");

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, manifest }, null, 2));
