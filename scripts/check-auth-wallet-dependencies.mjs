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
const checkout = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/checkout/package.json"),
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
  checkout: {
    "qrcode": "1.5.4",
    "@powerchain/solana": "workspace:*",
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

for (const [name, version] of Object.entries(expected.checkout)) {
  if (checkout.dependencies?.[name] !== version) {
    failures.push(`checkout ${name} must be ${version}`);
  }
}

if (checkout.devDependencies?.["@types/qrcode"] !== "1.5.6") {
  failures.push("checkout @types/qrcode must be 1.5.6");
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


if (!/@solana\/spl-token':?\s*\n\s+specifier:\s+0\.4\.15/m.test(lock)) {
  failures.push(
    "pnpm-lock.yaml still pins @solana/spl-token before 0.4.15; run pnpm install --no-frozen-lockfile",
  );
}

if (!/qrcode:\s*\n\s+specifier:\s+1\.5\.4/m.test(lock)) {
  failures.push(
    "pnpm-lock.yaml has not been regenerated for checkout qrcode 1.5.4; run pnpm install --no-frozen-lockfile",
  );
}

if (!/'@types\/qrcode':\s*\n\s+specifier:\s+1\.5\.6/m.test(lock)) {
  failures.push(
    "pnpm-lock.yaml has not been regenerated for @types/qrcode 1.5.6; run pnpm install --no-frozen-lockfile",
  );
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
