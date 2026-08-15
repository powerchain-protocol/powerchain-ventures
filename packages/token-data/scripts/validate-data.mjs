import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const payload = JSON.parse(fs.readFileSync(path.join(pkgRoot, "data/pwrc.json"), "utf8"));
const token = payload.token;
const errors = [];
const expected = BigInt(token.totalSupplyTokens) * 10n ** BigInt(token.decimals);
if (expected !== BigInt(token.totalSupplyBaseUnits)) errors.push("PWRC supply invariant failed");
if (token.version !== "1.0.0") errors.push("PWRC version must remain 1.0.0");
if (token.deploymentStatus === "verified" && !token.mintAddress) errors.push("verified deployment requires mintAddress");
if (payload.feePolicy.purchaseServiceFeeBps !== 250) errors.push("purchase service fee must be 250 bps");
if (payload.feePolicy.claimServiceFeeBps !== 0) errors.push("claim service fee must be zero");
if (errors.length) {
  console.error(JSON.stringify({ ok:false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, symbol:token.symbol, supply:token.totalSupplyTokens, decimals:token.decimals, deploymentStatus:token.deploymentStatus }, null, 2));
