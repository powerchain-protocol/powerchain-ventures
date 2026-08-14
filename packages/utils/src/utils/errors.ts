export type PowerChainErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NOT_ELIGIBLE"
  | "SALE_CLOSED"
  | "QUOTE_EXPIRED"
  | "RATE_LIMITED"
  | "RPC_UNAVAILABLE"
  | "TRANSACTION_REJECTED"
  | "TRANSACTION_FAILED"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_ERROR";

export class PowerChainError extends Error {
  readonly code: PowerChainErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly details?: unknown;

  constructor(code: PowerChainErrorCode, message: string, options: { status?: number; retryable?: boolean; details?: unknown; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.name = "PowerChainError";
    this.code = code;
    this.status = options.status ?? defaultStatus(code);
    this.retryable = options.retryable ?? isRetryableCode(code);
    this.details = options.details;
  }
}

function defaultStatus(code: PowerChainErrorCode): number {
  switch (code) {
    case "BAD_REQUEST": return 400;
    case "UNAUTHORIZED": return 401;
    case "FORBIDDEN": return 403;
    case "NOT_FOUND": return 404;
    case "CONFLICT": return 409;
    case "NOT_ELIGIBLE": return 403;
    case "SALE_CLOSED": return 409;
    case "QUOTE_EXPIRED": return 410;
    case "RATE_LIMITED": return 429;
    case "RPC_UNAVAILABLE": return 503;
    case "TRANSACTION_REJECTED": return 409;
    case "TRANSACTION_FAILED": return 502;
    case "CONFIGURATION_ERROR": return 503;
    default: return 500;
  }
}

function isRetryableCode(code: PowerChainErrorCode): boolean {
  return code === "RATE_LIMITED" || code === "RPC_UNAVAILABLE" || code === "TRANSACTION_FAILED" || code === "INTERNAL_ERROR";
}

export function isPowerChainError(value: unknown): value is PowerChainError {
  return value instanceof PowerChainError;
}

export function messageOf(value: unknown, fallback = "Unexpected error"): string {
  if (value instanceof Error && value.message) return value.message;
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

export function errorCodeOf(value: unknown, fallback: PowerChainErrorCode = "INTERNAL_ERROR"): PowerChainErrorCode {
  if (value instanceof PowerChainError) return value.code;
  if (typeof value === "object" && value !== null && "code" in value && typeof (value as { code?: unknown }).code === "string") {
    return (value as { code: PowerChainErrorCode }).code;
  }
  return fallback;
}

export function normalizeError(value: unknown, fallback = "Unexpected error"): PowerChainError {
  if (value instanceof PowerChainError) return value;
  return new PowerChainError("INTERNAL_ERROR", messageOf(value, fallback), { cause: value });
}

export type ApiErrorPayload = {
  ok?: false;
  error?: { code?: string; message?: string; retryable?: boolean; details?: unknown };
  message?: string;
};

export function apiErrorMessage(payload: unknown, fallback = "Request failed"): string {
  if (typeof payload !== "object" || payload === null) return fallback;
  const body = payload as ApiErrorPayload;
  return body.error?.message || body.message || fallback;
}

export async function parseApiError(response: Response, fallback = "Request failed"): Promise<PowerChainError> {
  let body: ApiErrorPayload | null = null;
  try { body = await response.clone().json() as ApiErrorPayload; } catch { /* non-JSON response */ }
  const rawCode = body?.error?.code;
  const known = new Set<PowerChainErrorCode>([
    "BAD_REQUEST","UNAUTHORIZED","FORBIDDEN","NOT_FOUND","CONFLICT","NOT_ELIGIBLE","SALE_CLOSED","QUOTE_EXPIRED","RATE_LIMITED","RPC_UNAVAILABLE","TRANSACTION_REJECTED","TRANSACTION_FAILED","CONFIGURATION_ERROR","INTERNAL_ERROR"
  ]);
  const code: PowerChainErrorCode = rawCode && known.has(rawCode as PowerChainErrorCode)
    ? rawCode as PowerChainErrorCode
    : response.status === 429 ? "RATE_LIMITED"
      : response.status === 401 ? "UNAUTHORIZED"
        : response.status === 403 ? "FORBIDDEN"
          : response.status === 404 ? "NOT_FOUND"
            : response.status >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST";
  const options: { status: number; retryable?: boolean; details?: unknown } = { status: response.status };
  if (body?.error?.retryable !== undefined) options.retryable = body.error.retryable;
  if (body?.error?.details !== undefined) options.details = body.error.details;
  return new PowerChainError(code, apiErrorMessage(body, fallback), options);
}
