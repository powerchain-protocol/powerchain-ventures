import { PublicKey } from "@solana/web3.js";
import { PowerChainError } from "@powerchain/utils/utils/errors";

export function requireString(value: unknown, field: string, max = 512) {
  if (typeof value !== "string" || !value.trim()) throw new PowerChainError("BAD_REQUEST", `${field} is required`);
  const out = value.trim();
  if (out.length > max) throw new PowerChainError("BAD_REQUEST", `${field} is too long`);
  return out;
}
export function optionalString(value: unknown, field: string, max = 512) {
  if (value == null || value === "") return undefined;
  return requireString(value, field, max);
}
export function requireSolanaAddress(value: unknown, field = "wallet") {
  const out = requireString(value, field, 64);
  try { return new PublicKey(out).toBase58(); } catch { throw new PowerChainError("BAD_REQUEST", `${field} is not a valid Solana address`); }
}

export function requireSuiAddress(
  value: unknown,
  field = "wallet",
) {
  const out =
    requireString(
      value,
      field,
      66,
    ).toLowerCase();

  if (!/^0x[0-9a-f]{64}$/.test(out)) {
    throw new PowerChainError(
      "BAD_REQUEST",
      `${field} is not a valid Sui address`,
    );
  }

  return out;
}

export function requireUuid(value: unknown, field = "id") {
  const out = requireString(value, field, 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(out)) throw new PowerChainError("BAD_REQUEST", `${field} is invalid`);
  return out;
}
export function requirePositiveBigInt(value: unknown, field: string) {
  const out = requireString(value, field, 80);
  if (!/^[1-9][0-9]*$/.test(out)) throw new PowerChainError("BAD_REQUEST", `${field} must be a positive integer string`);
  return BigInt(out);
}
export function boundedInteger(value: unknown, field: string, min: number, max: number, fallback?: number) {
  if ((value == null || value === "") && fallback != null) return fallback;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(n) || n < min || n > max) throw new PowerChainError("BAD_REQUEST", `${field} must be an integer from ${min} to ${max}`);
  return n;
}
export function requireEnum<T extends string>(value: unknown, field: string, allowed: readonly T[]): T {
  const out = requireString(value, field, 80) as T;
  if (!allowed.includes(out)) throw new PowerChainError("BAD_REQUEST", `${field} is invalid`);
  return out;
}

export function validateEmail(value: unknown) {
  const email = requireString(value, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new PowerChainError("BAD_REQUEST", "Enter a valid email address");
  return email;
}

export function validatePassword(value: unknown) {
  if (typeof value !== "string") throw new PowerChainError("BAD_REQUEST", "password is required");
  if (value.length < 10) throw new PowerChainError("BAD_REQUEST", "Password must be at least 10 characters");
  if (value.length > 128) throw new PowerChainError("BAD_REQUEST", "Password is too long");
  return value;
}

export function validateDisplayName(value: unknown) {
  if (value == null || value === "") return "";
  const name = requireString(value, "displayName", 80);
  if (/[<>]/.test(name)) throw new PowerChainError("BAD_REQUEST", "Display name contains unsupported characters");
  return name;
}
