import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const frontend = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/frontend/package.json"),
    "utf8",
  ),
);
const backend = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/backend/package.json"),
    "utf8",
  ),
);

const expected = {
  frontend: {
    "better-auth": "1.6.25",
    "@web3icons/react": "4.1.19",
    "@mysten/dapp-kit-react": "2.1.14",
    "@mysten/sui": "2.22.0",
  },
  backend: {
    "better-auth": "1.6.25",
  },
};

for (const [name, version] of Object.entries(expected.frontend)) {
  if (frontend.dependencies?.[name] !== version) {
    failures.push(`frontend ${name} must be ${version}`);
  }
}

for (const [name, version] of Object.entries(expected.backend)) {
  if (backend.dependencies?.[name] !== version) {
    failures.push(`backend ${name} must be ${version}`);
  }
}

const lock = fs.readFileSync(
  path.join(root, "pnpm-lock.yaml"),
  "utf8",
);

for (const name of [
  "better-auth",
  "@web3icons/react",
  "@mysten/dapp-kit-react",
  "@mysten/sui",
]) {
  if (!lock.includes(name)) {
    failures.push(
      `pnpm-lock.yaml has not been regenerated for ${name}; run pnpm install --no-frozen-lockfile`,
    );
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
  actionable:
    failures.some(value => value.includes("pnpm-lock.yaml"))
      ? "Run pnpm install --no-frozen-lockfile under Node 24, then rerun this doctor."
      : null,
}, null, 2));

if (failures.length) process.exit(1);
