import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

test("frontend has reusable UI primitives and service boundaries", () => {
  for (const rel of [
    "apps/frontend/components/ui/button.tsx",
    "apps/frontend/components/ui/card.tsx",
    "apps/frontend/components/ui/tabs.tsx",
    "apps/frontend/services/api-client.ts",
    "apps/frontend/services/auth-service.ts",
    "apps/frontend/actions/auth-actions.ts",
    "apps/frontend/context/ui-context.tsx",
  ]) {
    assert.equal(exists(rel), true, `${rel} missing`);
  }
});

test("contact flow is full stack", () => {
  for (const rel of [
    "apps/frontend/app/contact/page.tsx",
    "apps/frontend/components/contact/contact-form.tsx",
    "apps/backend/app/api/v1/contact/route.ts",
    "packages/mail/src/contact-email-template.tsx",
  ]) {
    assert.equal(exists(rel), true, `${rel} missing`);
  }
});

test("mail package remains server-delivery oriented", () => {
  const frontend = fs.readFileSync(
    path.join(root, "apps/frontend/.env.example"),
    "utf8",
  );
  assert.doesNotMatch(frontend, /^RESEND_API_KEY=/m);

  const backend = fs.readFileSync(
    path.join(root, "apps/backend/.env.example"),
    "utf8",
  );
  assert.match(backend, /^MAIL_PROVIDER=/m);
  assert.match(backend, /^RESEND_API_KEY=/m);
});

test("checkout is isolated in its own app and uses shared UI", () => {
  for (const rel of [
    "apps/checkout/package.json",
    "apps/checkout/components/payment-methods.tsx",
    "apps/checkout/components/purchase-flow.tsx",
    "packages/ui/src/tabs.tsx",
  ]) {
    assert.equal(exists(rel), true, `${rel} missing`);
  }
  assert.equal(exists("apps/frontend/components/checkout"), false);
  assert.equal(exists("apps/frontend/app/checkout"), false);
});
