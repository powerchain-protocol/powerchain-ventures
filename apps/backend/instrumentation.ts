export async function register() {
  if (
    process.env.NEXT_RUNTIME !==
    "nodejs"
  ) {
    return;
  }

  const {
    bootstrapRuntimePersistence,
  } =
    await import(
      "./lib/runtime-persistence/bootstrap"
    );

  await bootstrapRuntimePersistence();
}
