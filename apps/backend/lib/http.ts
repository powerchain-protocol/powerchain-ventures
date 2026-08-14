import { PowerChainError } from "@powerchain/utils/utils/errors";
import { classifyError } from "./utils/errors";

export type ApiErrorCode =
  | "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT"
  | "NOT_ELIGIBLE" | "SALE_CLOSED" | "QUOTE_EXPIRED" | "RATE_LIMITED"
  | "RPC_UNAVAILABLE" | "TRANSACTION_REJECTED" | "TRANSACTION_FAILED"
  | "CONFIGURATION_ERROR" | "INTERNAL_ERROR";

const MAX_JSON_BYTES = 1_048_576;

export function json(data: unknown, init: ResponseInit = {}, requestIdValue?: string) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  if (requestIdValue) headers.set("x-request-id", requestIdValue);
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(code: ApiErrorCode, message: string, status = 400, details?: unknown, requestIdValue?: string) {
  return json({ ok: false, error: { code, message, ...(details === undefined ? {} : { details }), ...(requestIdValue ? { requestId: requestIdValue } : {}) } }, { status }, requestIdValue);
}

export function errorFromUnknown(value: unknown, requestIdValue?: string) {
  const normalized = classifyError(value);
  const details = process.env.NODE_ENV === "production"
    ? (requestIdValue ? { requestId: requestIdValue } : undefined)
    : { requestId: requestIdValue, cause: normalized.cause instanceof Error ? normalized.cause.message : undefined };
  return error(normalized.code, normalized.message, normalized.status, details, requestIdValue);
}

export async function readJson<T>(request: Request): Promise<T> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) throw new PowerChainError("BAD_REQUEST", "content-type must be application/json");
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_JSON_BYTES) throw new PowerChainError("BAD_REQUEST", "request body too large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) throw new PowerChainError("BAD_REQUEST", "request body too large");
  try { return JSON.parse(text) as T; }
  catch (cause) { throw new PowerChainError("BAD_REQUEST", "invalid JSON body", { cause }); }
}

export function requestId(request: Request) {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}
