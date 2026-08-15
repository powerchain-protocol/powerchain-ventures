export const REQUIRED_RUNTIME_TABLES =
  Object.freeze([
    "powerchain_runtime_rate_limits",
    "powerchain_runtime_idempotency",
    "powerchain_runtime_audit",
    "powerchain_runtime_mutation_receipts",
    "powerchain_runtime_idempotency_reservations",
    "powerchain_runtime_mutation_leases",
    "powerchain_runtime_settlements",
    "powerchain_runtime_outbox",
  ] as const);

export const REQUIRED_RUNTIME_COLUMNS =
  Object.freeze({
    powerchain_runtime_outbox: [
      "last_error",
      "last_error_at",
      "failed_at",
      "updated_at",
    ],
  } as const);

export type RuntimeSchemaStatus = {
  ready: boolean;
  requiredTables:
    readonly string[];
  missingTables:
    readonly string[];
  missingColumns:
    readonly string[];
};

type QueryClient = {
  $queryRawUnsafe<
    T = unknown,
  >(
    query: string,
    ...values: unknown[]
  ): Promise<T>;
};

export async function checkRuntimeSchema(
  client: QueryClient,
): Promise<RuntimeSchemaStatus> {
  const values =
    REQUIRED_RUNTIME_TABLES
      .map(
        value =>
          `('${value.replace(
            /'/g,
            "''",
          )}')`,
      )
      .join(",");

  const rows =
    await client.$queryRawUnsafe<
      Array<{
        name: string;
        relation:
          string | null;
      }>
    >(
      `
      SELECT v.name,
             to_regclass(v.name)::text AS relation
      FROM (
        VALUES ${values}
      ) AS v(name)
      ORDER BY v.name
      `,
    );

  const missingTables =
    rows
      .filter(
        row =>
          !row.relation,
      )
      .map(
        row => row.name,
      );

  const missingColumns:
    string[] = [];

  if (
    !missingTables.includes(
      "powerchain_runtime_outbox",
    )
  ) {
    const columns =
      await client.$queryRawUnsafe<
        Array<{
          column_name: string;
        }>
      >(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'powerchain_runtime_outbox'
        `,
      );

    const available =
      new Set(
        columns.map(
          row =>
            row.column_name,
        ),
      );

    for (
      const column
      of REQUIRED_RUNTIME_COLUMNS
        .powerchain_runtime_outbox
    ) {
      if (
        !available.has(column)
      ) {
        missingColumns.push(
          `powerchain_runtime_outbox.${column}`,
        );
      }
    }
  }

  return {
    ready:
      missingTables.length ===
        0 &&
      missingColumns.length ===
        0,
    requiredTables:
      REQUIRED_RUNTIME_TABLES,
    missingTables,
    missingColumns,
  };
}
