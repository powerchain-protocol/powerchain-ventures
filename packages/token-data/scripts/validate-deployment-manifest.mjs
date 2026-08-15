import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/deployment-manifest.json"), "utf8"));

const errors = [];
if (manifest.release !== "1.0.0") errors.push("release must remain 1.0.0");
if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (manifest.network !== "solana-mainnet-beta") errors.push("network must be solana-mainnet-beta");
if (manifest.security?.serverSecretsInClientBundles !== false) errors.push("server secrets in client bundles must be false");
if (manifest.security?.httpsRpcRequiredInProduction !== true) errors.push("production RPC must require https");
if (manifest.security?.globalBuildScriptBypassAllowed !== false) errors.push("global build script bypass must remain disabled");

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, endpoints:manifest.requiredPublicEndpoints.length }, null, 2));
