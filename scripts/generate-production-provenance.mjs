import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const check = process.argv.includes("--check");
const output = path.join(root, "docs/reports/validation/production-provenance.json");

const files = [
  "packages/token-data/data/pwrc.json",
  "packages/token-data/data/public-registry.json",
  "packages/token-data/data/integrity.json",
  "packages/token-data/data/release-manifest.json",
  "packages/token-data/data/client-snapshot-manifest.json",
  "packages/token-data/data/public-api.openapi.json",
];

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const rootPkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifest = {
  product: "PowerChain Launchpad",
  release: "1.0.0",
  packageManager: rootPkg.packageManager ?? null,
  schemaVersion: 1,
  generatedAt: "2026-08-15T00:00:00.000Z",
  artifacts: {},
};

for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.error(`Missing provenance input: ${rel}`);
    process.exit(1);
  }
  manifest.artifacts[rel] = {
    sha256: sha256(file),
    bytes: fs.statSync(file).size,
  };
}

const serialized = JSON.stringify(manifest, null, 2) + "\n";

if (check) {
  if (!fs.existsSync(output)) {
    console.error("production-provenance.json missing");
    process.exit(1);
  }
  const existing = fs.readFileSync(output, "utf8");
  if (existing !== serialized) {
    console.error("production provenance drift detected");
    process.exit(1);
  }
  console.log("Production provenance check passed.");
} else {
  fs.mkdirSync(path.dirname(output), { recursive:true });
  fs.writeFileSync(output, serialized);
  console.log(`Wrote ${path.relative(root, output)}`);
}
