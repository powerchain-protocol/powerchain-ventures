import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data/runtime-protection-manifest.json"), "utf8"));

const errors = [];
if (data.release !== "1.0.0") errors.push("release must remain 1.0.0");
if (data.schemaVersion !== 1) errors.push("schemaVersion must be 1");
for (const [name, enabled] of Object.entries(data.protections ?? {})) {
  if (enabled !== true) errors.push(`runtime protection ${name} must be enabled`);
}
if (data.rateLimitBackend !== "adapter-backed") errors.push("rate-limit backend must be adapter-backed");
if (data.idempotencyBackend !== "adapter-backed") errors.push("idempotency backend must be adapter-backed");
if (data.persistentDatabaseAdapter !== true) errors.push("persistent database adapter must be enabled");

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, protections:Object.keys(data.protections).length }, null, 2));
