import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

for (const rel of [
  "apps/frontend/components/ui/button.tsx",
  "apps/frontend/components/ui/card.tsx",
  "apps/frontend/components/ui/tabs.tsx",
  "apps/frontend/services/api-client.ts",
  "apps/frontend/services/auth-service.ts",
  "apps/frontend/services/contact-service.ts",
  "apps/frontend/actions/auth-actions.ts",
  "apps/frontend/actions/contact-actions.ts",
  "apps/frontend/context/ui-context.tsx",
  "apps/frontend/app/contact/page.tsx",
  "apps/checkout/components/purchase-flow.tsx",
  "packages/ui/src/tabs.tsx",
  "apps/backend/app/api/v1/contact/route.ts",
  "packages/mail/src/email-template.tsx",
]) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const frontendEnv = fs.readFileSync(
  path.join(root, "apps/frontend/.env.example"),
  "utf8",
);
if (/^RESEND_API_KEY=/m.test(frontendEnv)) {
  failures.push("frontend environment exposes mail provider secret");
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
