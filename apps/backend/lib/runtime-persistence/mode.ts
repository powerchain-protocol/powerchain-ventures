export type RuntimePersistenceMode =
  | "memory"
  | "database";

export function configuredRuntimePersistenceMode(
  env: NodeJS.ProcessEnv = process.env,
): RuntimePersistenceMode {
  const raw =
    env.POWERCHAIN_RUNTIME_PERSISTENCE
      ?.trim()
      .toLowerCase();

  if (raw) {
    if (
      raw !== "memory" &&
      raw !== "database"
    ) {
      throw new Error(
        "POWERCHAIN_RUNTIME_PERSISTENCE must be memory or database",
      );
    }
    return raw;
  }

  if (
    env.NODE_ENV === "production"
  ) {
    return "database";
  }

  return env.DATABASE_URL?.trim()
    ? "database"
    : "memory";
}

export function assertRuntimePersistencePolicy(
  env: NodeJS.ProcessEnv = process.env,
): RuntimePersistenceMode {
  const mode =
    configuredRuntimePersistenceMode(
      env,
    );

  if (
    env.NODE_ENV ===
      "production" &&
    mode !== "database"
  ) {
    throw new Error(
      "Production runtime persistence must use database mode",
    );
  }

  if (mode === "database") {
    const url =
      env.DATABASE_URL?.trim();

    if (!url) {
      throw new Error(
        "DATABASE_URL is required when POWERCHAIN_RUNTIME_PERSISTENCE=database",
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(
        "DATABASE_URL must be a valid PostgreSQL URL",
      );
    }

    if (
      parsed.protocol !==
        "postgres:" &&
      parsed.protocol !==
        "postgresql:"
    ) {
      throw new Error(
        "Runtime PrismaPg persistence requires a postgres:// or postgresql:// DATABASE_URL",
      );
    }
  }

  return mode;
}
