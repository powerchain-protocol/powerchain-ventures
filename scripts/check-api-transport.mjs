import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "packages/config/src/endpoints.ts",
  "packages/solana/src/websocket.ts",
  "packages/utils/src/formats.ts",
  "packages/utils/src/backend-proxy.ts",
  "packages/domain/src/payments.ts",
  "apps/backend/lib/solana-websocket.ts",
  "apps/backend/app/api/v1/endpoints/route.ts",
  "apps/backend/app/api/v1/transport/status/route.ts",
  "apps/backend/app/api/v1/solana/ws/status/route.ts",
  "apps/frontend/services/realtime-service.ts",
  "apps/frontend/app/api/v1/[...path]/route.ts",
  "apps/checkout/app/api/v1/[...path]/route.ts",
]) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const websocket = fs.readFileSync(
  path.join(root, "packages/solana/src/websocket.ts"),
  "utf8",
);
for (const required of [
  "signatureSubscribe",
  "accountSubscribe",
  "#scheduleReconnect",
  "#resubscribe",
  "healthIntervalMs",
]) {
  if (!websocket.includes(required)) {
    failures.push(`websocket transport missing ${required}`);
  }
}

const proxy = fs.readFileSync(
  path.join(root, "packages/utils/src/backend-proxy.ts"),
  "utf8",
);
for (const guard of [
  "BACKEND_FALLBACK_ORIGINS",
  "idempotency-key",
  "x-powerchain-backend-fallback",
]) {
  if (!proxy.includes(guard)) {
    failures.push(`shared backend proxy missing ${guard}`);
  }
}

for (const app of ["frontend", "checkout"]) {
  const route = fs.readFileSync(
    path.join(root, `apps/${app}/app/api/v1/[...path]/route.ts`),
    "utf8",
  );
  if (!route.includes("forwardBackendRequest")) {
    failures.push(`${app} API route does not use shared backend proxy`);
  }
}

for (const envFile of [
  "apps/frontend/.env.example",
  "apps/checkout/.env.example",
]) {
  const source = fs.readFileSync(path.join(root, envFile), "utf8");
  for (const secret of [
    "HELIUS_API_KEY",
    "BIRDEYE_API_KEY",
    "COINMARKETCAP_API_KEY",
    "PYTH_API_KEY",
    "POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON",
  ]) {
    if (new RegExp(`^${secret}=`, "m").test(source)) {
      failures.push(`${envFile} exposes ${secret}`);
    }
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
