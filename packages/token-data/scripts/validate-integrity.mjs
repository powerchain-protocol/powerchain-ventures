import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const integrity = JSON.parse(fs.readFileSync(path.join(root, "data/integrity.json"), "utf8"));

const errors = [];
for (const [file, expected] of Object.entries(integrity.files)) {
  const full = path.join(root, "data", file);
  if (!fs.existsSync(full)) {
    errors.push(`${file} missing`);
    continue;
  }
  const actual = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  if (actual !== expected) errors.push(`${file} checksum mismatch`);
}
if (integrity.schemaVersion !== 1) errors.push("integrity schemaVersion must be 1");
if (integrity.algorithm !== "sha256") errors.push("integrity algorithm must be sha256");

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, files:Object.keys(integrity.files) }, null, 2));
