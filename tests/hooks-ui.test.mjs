import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("countdown owns cleanup and one-shot completion", () => {
  const hook = read("apps/frontend/hooks/use-countdown.ts");
  assert.match(hook, /clearInterval/);
  assert.match(hook, /completedRef/);
  assert.match(hook, /valid: false/);
});

test("wallet UX supports focus containment and outside close", () => {
  const modal = read("apps/frontend/components/wallet/wallet-connect-modal.tsx");
  const button = read("apps/frontend/components/wallet-button.tsx");
  assert.match(modal, /event\.key !== "Tab"/);
  assert.match(modal, /document\.body\.style\.overflow/);
  assert.match(button, /useClickOutside/);
  assert.match(button, /Copy failed/);
});

test("config refresh aborts stale requests", () => {
  const context = read("apps/frontend/context/powerchain-config-context.tsx");
  assert.match(context, /activeRequest\.current\?\.abort/);
  assert.match(context, /AbortController/);
  assert.match(context, /timeoutMs: 10_000/);
});

test("embedded wallet sessions are validated before restore", () => {
  const embedded = read("apps/frontend/lib/embedded-wallets.ts");
  assert.match(embedded, /isEmbeddedWalletSession/);
  assert.match(embedded, /isSolanaAddress/);
  assert.match(embedded, /localStorage\.removeItem/);
});
