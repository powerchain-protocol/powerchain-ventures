import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function readJson(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function value(pkg, name) {
  return pkg?.dependencies?.[name]
    ?? pkg?.devDependencies?.[name]
    ?? pkg?.peerDependencies?.[name]
    ?? null;
}

function exact(scope, pkg, name, expected, severity = "error") {
  const actual = value(pkg, name);
  if (actual === null) return;
  if (actual === expected) {
    console.log(`[ok] ${scope}:${name}=${actual}`);
    return;
  }
  const message = `${scope}:${name} expected ${expected}, found ${actual}`;
  if (severity === "warn") {
    warnings.push(message);
    console.warn(`[warn] ${message}`);
  } else {
    failures.push(message);
    console.error(`[fail] ${message}`);
  }
}

const rootPkg = readJson("package.json");
const frontend = readJson("apps/frontend/package.json");
const backend = readJson("apps/backend/package.json");
const mobile = readJson("apps/mobile/package.json");

if (rootPkg?.version !== "1.0.0") failures.push(`root version must be 1.0.0, found ${rootPkg?.version}`);
if (rootPkg?.packageManager !== "pnpm@11.21.0") warnings.push(`packageManager expected pnpm@11.21.0, found ${rootPkg?.packageManager ?? "<missing>"}`);

exact("frontend", frontend, "next", "16.2.12", "warn");
exact("backend", backend, "next", "16.2.12", "warn");
exact("frontend", frontend, "react", "19.2.0", "warn");
exact("mobile", mobile, "react", "19.2.0", "warn");
exact("mobile", mobile, "react-native-screens", "4.26.0");
exact("frontend", frontend, "@solana/connector", "0.2.6");
exact("root", rootPkg, "uuid", "14.0.1", "warn");

for (const [scope, pkg] of [["frontend", frontend], ["backend", backend], ["mobile", mobile]]) {
  if (!pkg) continue;
  if (value(pkg, "@powerchain/token-data") !== "workspace:*") {
    failures.push(`${scope} must depend on @powerchain/token-data via workspace:*`);
  }
}

const workspace = path.join(root, "pnpm-workspace.yaml");
if (fs.existsSync(workspace)) {
  const text = fs.readFileSync(workspace, "utf8");
  for (const required of [
    "strictDepBuilds: true",
    "linkWorkspacePackages: true",
    "preferWorkspacePackages: true",
  ]) {
    if (!text.includes(required)) failures.push(`pnpm-workspace.yaml missing ${required}`);
  }
  if (text.includes("dangerouslyAllowAllBuilds: true")) {
    failures.push("dangerouslyAllowAllBuilds must not be enabled");
  }
}

console.log(`\nDependency guard: ${failures.length} failure(s), ${warnings.length} warning(s).`);
if (warnings.length) {
  for (const warning of warnings) console.warn(`[warn] ${warning}`);
}
if (failures.length) process.exit(1);
