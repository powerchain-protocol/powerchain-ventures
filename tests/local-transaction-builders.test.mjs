import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = rel =>
  fs.readFileSync(
    rel,
    "utf8",
  );

test("claims are prepared locally and simulated", () => {
  const route =
    read(
      "apps/backend/app/api/v1/launchpad/claim/prepare/route.ts",
    );
  const builder =
    read(
      "apps/backend/lib/local-program-transaction-builder.ts",
    );

  assert.match(
    route,
    /buildLocalClaimTransaction/,
  );
  assert.doesNotMatch(
    route,
    /buildTransaction\("claim"/,
  );
  assert.match(
    builder,
    /simulateTransaction/,
  );
  assert.match(
    builder,
    /createAssociatedTokenAccountIdempotentInstruction/,
  );
});

test("creator lifecycle and program operations are prepared locally", () => {
  const lifecycle =
    read(
      "apps/backend/app/api/v1/launchpad/sales/action/prepare/route.ts",
    );
  const operations =
    read(
      "apps/backend/app/api/v1/launchpad/program/operations/prepare/route.ts",
    );

  assert.match(
    lifecycle,
    /buildLocalCreatorTransaction/,
  );
  assert.doesNotMatch(
    lifecycle,
    /unavailablePlan/,
  );
  assert.match(
    operations,
    /buildLocalCreatorTransaction/,
  );
  assert.doesNotMatch(
    operations,
    /unavailablePlan/,
  );
});

test("sale activation is local when creator controls the vault", () => {
  const route =
    read(
      "apps/backend/app/api/v1/launchpad/sales/draft/route.ts",
    );

  assert.match(
    route,
    /sourceVaultAuthority\)===String\(b\.creatorWallet\)/,
  );
  assert.match(
    route,
    /buildLocalSaleActivationTransaction/,
  );
  assert.match(
    route,
    /buildTransaction\("sale-activation"/,
  );
});

test("delegated vault builder is optional in production readiness", () => {
  const ready =
    read(
      "apps/backend/app/api/v1/ready/route.ts",
    );
  const config =
    read(
      "packages/config/src/constants.ts",
    );
  const preflight =
    read(
      "scripts/check-production-env.mjs",
    );

  assert.match(
    ready,
    /delegatedVaultActivation/,
  );
  assert.match(
    ready,
    /localTransactionBuilders/,
  );
  assert.doesNotMatch(
    config,
    /"POWERCHAIN_TRANSACTION_BUILDER_URL"/,
  );
  assert.match(
    preflight,
    /POWERCHAIN_DELEGATED_VAULT_ACTIVATION_ENABLED/,
  );
});

test("sale draft rejects impossible vesting cliff duration ordering", () => {
  const route =
    read(
      "apps/backend/app/api/v1/launchpad/sales/draft/route.ts",
    );

  assert.match(
    route,
    /duration===0\|\|cliff>duration/,
  );
});
