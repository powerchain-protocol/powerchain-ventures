import {
  configureDatabaseRuntimePersistence,
} from "./configure";
import {
  getRuntimePersistence,
} from "./index";
import {
  assertRuntimePersistencePolicy,
  type RuntimePersistenceMode,
} from "./mode";
import {
  runtimePrismaClient,
} from "./client";
import {
  checkRuntimeSchema,
  type RuntimeSchemaStatus,
} from "./schema";

export type RuntimeBootstrapStatus = {
  initialized: boolean;
  mode:
    RuntimePersistenceMode;
  schema:
    RuntimeSchemaStatus | null;
  initializedAt:
    string | null;
  error:
    string | null;
};

let bootstrap:
  Promise<RuntimeBootstrapStatus> |
  null = null;

let status:
  RuntimeBootstrapStatus = {
    initialized: false,
    mode: "memory",
    schema: null,
    initializedAt: null,
    error: null,
  };

async function initialize():
  Promise<RuntimeBootstrapStatus> {
  const mode =
    assertRuntimePersistencePolicy();

  if (mode === "memory") {
    status = {
      initialized: true,
      mode,
      schema: null,
      initializedAt:
        new Date().toISOString(),
      error: null,
    };
    return status;
  }

  const client =
    runtimePrismaClient();

  await client.$connect();

  const schema =
    await checkRuntimeSchema(
      client,
    );

  if (!schema.ready) {
    const missing = [
      ...schema.missingTables,
      ...schema.missingColumns,
    ];

    throw new Error(
      `Runtime database migrations are incomplete; missing: ${missing.join(
        ", ",
      )}`,
    );
  }

  configureDatabaseRuntimePersistence(
    client,
  );

  if (
    getRuntimePersistence()
      .mode !== "database"
  ) {
    throw new Error(
      "Runtime database persistence failed to activate",
    );
  }

  status = {
    initialized: true,
    mode,
    schema,
    initializedAt:
      new Date().toISOString(),
    error: null,
  };

  return status;
}

export async function bootstrapRuntimePersistence():
  Promise<RuntimeBootstrapStatus> {
  if (!bootstrap) {
    bootstrap =
      initialize().catch(
        error => {
          const message =
            error instanceof Error
              ? error.message
              : "Runtime persistence bootstrap failed";

          status = {
            ...status,
            initialized: false,
            error: message,
          };

          // Permit a later retry in local/dev after configuration changes.
          bootstrap = null;
          throw error;
        },
      );
  }

  return bootstrap;
}

export function runtimeBootstrapStatus():
  RuntimeBootstrapStatus {
  return {
    ...status,
    schema:
      status.schema
        ? {
            ...status.schema,
            requiredTables: [
              ...status.schema
                .requiredTables,
            ],
            missingTables: [
              ...status.schema
                .missingTables,
            ],
            missingColumns: [
              ...status.schema
                .missingColumns,
            ],
          }
        : null,
  };
}
