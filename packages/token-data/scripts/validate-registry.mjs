import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const registry = JSON.parse(fs.readFileSync(path.join(pkgRoot, "data/public-registry.json"), "utf8"));
const pwrc = JSON.parse(fs.readFileSync(path.join(pkgRoot, "data/pwrc.json"), "utf8"));

const errors = [];
if (registry.schemaVersion !== 1) errors.push("registry schemaVersion must be 1");
if (registry.data.release !== "1.0.0") errors.push("registry release must remain 1.0.0");
if (registry.data.chain !== "solana" || registry.data.cluster !== "mainnet-beta") {
  errors.push("registry chain/cluster mismatch");
}
if (JSON.stringify(registry.data.tokens.PWRC) !== JSON.stringify(pwrc)) {
  errors.push("registry PWRC payload drifted from canonical pwrc.json");
}
if (registry.data.tokens.PWRC.token.deploymentStatus === "verified" &&
    !registry.data.tokens.PWRC.token.mintAddress) {
  errors.push("verified PWRC requires mintAddress");
}

if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, version:registry.data.version, tokens:Object.keys(registry.data.tokens) }, null, 2));
