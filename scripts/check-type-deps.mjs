import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const failures = [];

function packageRequire(relativePackageJson) {
  return createRequire(path.join(root, relativePackageJson));
}

function checkResolved(label, req, target) {
  try {
    const resolved = req.resolve(target);
    const normalizedRoot = path.resolve(root) + path.sep;
    const normalizedResolved = path.resolve(resolved);
    if (!normalizedResolved.startsWith(normalizedRoot)) {
      throw new Error(`resolved outside workspace: ${normalizedResolved}`);
    }
    console.log(`[ok] ${label}: ${resolved}`);
  } catch {
    failures.push(label);
    console.error(`[missing] ${label}`);
  }
}

if (!fs.existsSync(path.join(root, "node_modules"))) {
  failures.push("root node_modules");
  console.error("[missing] root node_modules");
}

const rootRequire = packageRequire("package.json");
const frontendRequire = packageRequire("apps/frontend/package.json");
const backendRequire = packageRequire("apps/backend/package.json");
const mobileRequire = packageRequire("apps/mobile/package.json");

checkResolved("root TypeScript", rootRequire, "typescript/package.json");
checkResolved("root Node types", rootRequire, "@types/node/package.json");
checkResolved("root Next.js", rootRequire, "next/package.json");

checkResolved("frontend Next.js", frontendRequire, "next/package.json");
checkResolved("frontend React", frontendRequire, "react/package.json");
checkResolved("frontend React DOM", frontendRequire, "react-dom/package.json");
checkResolved("frontend React types", frontendRequire, "@types/react/package.json");
checkResolved("frontend React DOM types", frontendRequire, "@types/react-dom/package.json");
checkResolved("frontend Node types", frontendRequire, "@types/node/package.json");
checkResolved("frontend ConnectorKit React", frontendRequire, "@solana/connector/react");
checkResolved("frontend ConnectorKit headless", frontendRequire, "@solana/connector/headless");

checkResolved("backend Next.js", backendRequire, "next/package.json");
checkResolved("backend React", backendRequire, "react/package.json");
checkResolved("backend React DOM", backendRequire, "react-dom/package.json");
checkResolved("backend React types", backendRequire, "@types/react/package.json");
checkResolved("backend React DOM types", backendRequire, "@types/react-dom/package.json");
checkResolved("backend Node types", backendRequire, "@types/node/package.json");

checkResolved("mobile Expo", mobileRequire, "expo/package.json");
checkResolved("mobile Expo Router", mobileRequire, "expo-router/package.json");
checkResolved("mobile React", mobileRequire, "react/package.json");
checkResolved("mobile React Native", mobileRequire, "react-native/package.json");
checkResolved("mobile React types", mobileRequire, "@types/react/package.json");
checkResolved("mobile TypeScript", mobileRequire, "typescript/package.json");
checkResolved("mobile PowerChain config", mobileRequire, "@powerchain/launchpad-config");
checkResolved("mobile PowerChain utils", mobileRequire, "@powerchain/utils");

// Verify the private workspace packages that Next.js/TypeScript import directly.
checkResolved("frontend PowerChain config", frontendRequire, "@powerchain/launchpad-config");
checkResolved("frontend PowerChain utils", frontendRequire, "@powerchain/utils");
checkResolved("backend PowerChain config", backendRequire, "@powerchain/launchpad-config");
checkResolved("backend PowerChain utils", backendRequire, "@powerchain/utils");
checkResolved("backend PowerChain Solana", backendRequire, "@powerchain/solana");
checkResolved("backend PowerChain integrations", backendRequire, "@powerchain/integrations");

const backendPkg = JSON.parse(fs.readFileSync(path.join(root, "apps/backend/package.json"), "utf8"));
const frontendPkg = JSON.parse(fs.readFileSync(path.join(root, "apps/frontend/package.json"), "utf8"));
const solanaPkg = JSON.parse(fs.readFileSync(path.join(root, "packages/solana/package.json"), "utf8"));
const configPkg = JSON.parse(fs.readFileSync(path.join(root, "packages/config/package.json"), "utf8"));
const integrationsPkg = JSON.parse(fs.readFileSync(path.join(root, "packages/integrations/package.json"), "utf8"));
const utilsPkg = JSON.parse(fs.readFileSync(path.join(root, "packages/utils/package.json"), "utf8"));

for (const [label, pkg] of [["@powerchain/launchpad-config", configPkg], ["@powerchain/solana", solanaPkg], ["@powerchain/utils", utilsPkg], ["@powerchain/integrations", integrationsPkg]]) {
  if (!pkg.exports?.["."]) failures.push(`${label} package export`);
}

if (backendPkg.dependencies?.["@powerchain/solana"] !== "workspace:*") {
  failures.push("backend @powerchain/solana workspace dependency");
}
if (solanaPkg.name !== "@powerchain/solana") {
  failures.push("@powerchain/solana package name");
}
for (const [name, pkg] of [["frontend", frontendPkg], ["backend", backendPkg]]) {
  for (const dep of ["next", "react", "react-dom"]) {
    if (!pkg.dependencies?.[dep]) failures.push(`${name} dependency ${dep}`);
  }
  for (const dep of ["typescript", "@types/node", "@types/react", "@types/react-dom"]) {
    if (!pkg.devDependencies?.[dep]) failures.push(`${name} devDependency ${dep}`);
  }
}

if (failures.length) {
  console.error(`\nPowerChain type dependency doctor failed (${failures.length} issue${failures.length === 1 ? "" : "s"}).`);
  console.error("From the repository root run:");
  console.error("  corepack enable");
  console.error("  pnpm install");
  console.error("  pnpm doctor:types");
  console.error("\nThen in VS Code run: TypeScript: Select TypeScript Version → Use Workspace Version, followed by TypeScript: Restart TS Server.");
  process.exit(1);
}

console.log("\nPowerChain type dependency doctor passed.");
