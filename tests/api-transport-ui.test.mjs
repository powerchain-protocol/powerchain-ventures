import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = rel =>
  fs.readFileSync(path.join(root, rel), "utf8");

test("API v1 registry includes transport status", () => {
  const source =
    read("packages/config/src/endpoints.ts");

  assert.match(
    source,
    /API_V1_PREFIX = "\/api\/v1"/,
  );
  assert.match(source, /transportStatus/);
  assert.match(source, /websocketStatus/);
});

test("WebSocket transport reconnects and resubscribes", () => {
  const source =
    read("packages/solana/src/websocket.ts");

  assert.match(source, /signatureSubscribe/);
  assert.match(source, /accountSubscribe/);
  assert.match(source, /#scheduleReconnect/);
  assert.match(source, /#resubscribe/);
  assert.match(source, /60_000/);
});

test("shared API backend failover is idempotency aware", () => {
  const source = read(
    "packages/utils/src/backend-proxy.ts",
  );

  assert.match(source, /BACKEND_FALLBACK_ORIGINS/);
  assert.match(source, /idempotency-key/);
  assert.match(source, /x-powerchain-backend-fallback/);
  assert.match(
    read("apps/checkout/app/api/v1/[...path]/route.ts"),
    /forwardBackendRequest/,
  );
});

test("new responsive UI primitives exist", () => {
  for (const rel of [
    "apps/frontend/components/ui/forms.tsx",
    "apps/frontend/components/ui/dropdown.tsx",
    "apps/frontend/components/ui/badge.tsx",
    "apps/frontend/components/ui/select.tsx",
  ]) {
    assert.equal(
      fs.existsSync(path.join(root, rel)),
      true,
      `${rel} missing`,
    );
  }
});

test("formats and payment policy are centralized", () => {
  assert.match(
    read("packages/utils/src/formats.ts"),
    /formatBaseUnits/,
  );

  const payments =
    read("packages/domain/src/payments.ts");

  assert.match(
    payments,
    /POWERCHAIN_PAYMENT_POLICY/,
  );
  assert.match(
    payments,
    /purchaseServiceFeeBps: SERVICE_FEE_BPS/,
  );
  assert.match(
    payments,
    /claimServiceFeeBps: 0n/,
  );
});
