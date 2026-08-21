import { AppError } from "../errors.js";

const UNSAFE_FIELDS = new Set(["privateKey", "secretKey", "seed", "mnemonic", "password"]);

export function assertNoSecrets(value: unknown, path = "payload"): void {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (UNSAFE_FIELDS.has(key)) throw new AppError("secret_material_rejected", `${path}.${key} must never be sent to PowerChain.`, 400);
    assertNoSecrets(child, `${path}.${key}`);
  }
}

export function requireExplicitConfirmation(value: unknown) {
  if (value !== true) throw new AppError("confirmation_required", "Explicit confirmation is required for this operation.", 409);
}
