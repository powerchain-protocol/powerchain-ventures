import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();
const failures = [];

const read = rel =>
  fs.readFileSync(
    path.join(root, rel),
    "utf8",
  );

for (const rel of [
  "apps/backend/instrumentation.ts",
  "apps/backend/lib/runtime-persistence/mode.ts",
  "apps/backend/lib/runtime-persistence/client.ts",
  "apps/backend/lib/runtime-persistence/bootstrap.ts",
  "apps/backend/lib/runtime-persistence/schema.ts",
  "apps/backend/lib/runtime-persistence/health.ts",
  "database/migrations/035_runtime_persistence_bootstrap_outbox_health.sql",
]) {
  if (
    !fs.existsSync(
      path.join(root, rel),
    )
  ) {
    failures.push(
      `missing ${rel}`,
    );
  }
}

const mode =
  read(
    "apps/backend/lib/runtime-persistence/mode.ts",
  );

if (
  !mode.includes(
    'env.NODE_ENV === "production"',
  ) ||
  !mode.includes(
    'mode !== "database"',
  )
) {
  failures.push(
    "production runtime persistence does not fail closed on memory mode",
  );
}

const client =
  read(
    "apps/backend/lib/runtime-persistence/client.ts",
  );

for (const guard of [
  "@prisma/adapter-pg",
  "PrismaPg",
  "generated/prisma/client",
]) {
  if (
    !client.includes(guard)
  ) {
    failures.push(
      `runtime Prisma client missing ${guard}`,
    );
  }
}

const bootstrap =
  read(
    "apps/backend/lib/runtime-persistence/bootstrap.ts",
  );

for (const guard of [
  "assertRuntimePersistencePolicy",
  "checkRuntimeSchema",
  "configureDatabaseRuntimePersistence",
  "Runtime database migrations are incomplete",
]) {
  if (
    !bootstrap.includes(
      guard,
    )
  ) {
    failures.push(
      `runtime bootstrap missing ${guard}`,
    );
  }
}

const schema =
  read(
    "apps/backend/lib/runtime-persistence/schema.ts",
  );

for (const guard of [
  "powerchain_runtime_settlements",
  "powerchain_runtime_outbox",
  "last_error",
  "failed_at",
  "updated_at",
]) {
  if (
    !schema.includes(guard)
  ) {
    failures.push(
      `runtime schema check missing ${guard}`,
    );
  }
}

const health =
  read(
    "apps/backend/lib/runtime-persistence/health.ts",
  );

for (const guard of [
  "settlementsReady",
  "outboxReady",
  "expiredLeases",
  "oldestPendingAt",
]) {
  if (
    !health.includes(guard)
  ) {
    failures.push(
      `runtime health missing ${guard}`,
    );
  }
}

const migration =
  read(
    "database/migrations/035_runtime_persistence_bootstrap_outbox_health.sql",
  );

for (const guard of [
  "last_error",
  "last_error_at",
  "failed_at",
  "updated_at",
  "lease_until",
]) {
  if (
    !migration.includes(guard)
  ) {
    failures.push(
      `migration 035 missing ${guard}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ok:
        failures.length ===
        0,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) {
  process.exit(1);
}
