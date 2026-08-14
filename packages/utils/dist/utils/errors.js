export class PowerChainError extends Error {
    code;
    status;
    retryable;
    details;
    constructor(code, message, options = {}) {
        super(message, { cause: options.cause });
        this.name = "PowerChainError";
        this.code = code;
        this.status = options.status ?? defaultStatus(code);
        this.retryable = options.retryable ?? isRetryableCode(code);
        this.details = options.details;
    }
}
function defaultStatus(code) {
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
function isRetryableCode(code) {
    return code === "RATE_LIMITED" || code === "RPC_UNAVAILABLE" || code === "TRANSACTION_FAILED" || code === "INTERNAL_ERROR";
}
export function isPowerChainError(value) {
    return value instanceof PowerChainError;
}
export function messageOf(value, fallback = "Unexpected error") {
    if (value instanceof Error && value.message)
        return value.message;
    if (typeof value === "string" && value.trim())
        return value.trim();
    return fallback;
}
export function errorCodeOf(value, fallback = "INTERNAL_ERROR") {
    if (value instanceof PowerChainError)
        return value.code;
    if (typeof value === "object" && value !== null && "code" in value && typeof value.code === "string") {
        return value.code;
    }
    return fallback;
}
export function normalizeError(value, fallback = "Unexpected error") {
    if (value instanceof PowerChainError)
        return value;
    return new PowerChainError("INTERNAL_ERROR", messageOf(value, fallback), { cause: value });
}
export function apiErrorMessage(payload, fallback = "Request failed") {
    if (typeof payload !== "object" || payload === null)
        return fallback;
    const body = payload;
    return body.error?.message || body.message || fallback;
}
export async function parseApiError(response, fallback = "Request failed") {
    let body = null;
    try {
        body = await response.clone().json();
    }
    catch { /* non-JSON response */ }
    const rawCode = body?.error?.code;
    const known = new Set([
        "BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "CONFLICT", "NOT_ELIGIBLE", "SALE_CLOSED", "QUOTE_EXPIRED", "RATE_LIMITED", "RPC_UNAVAILABLE", "TRANSACTION_REJECTED", "TRANSACTION_FAILED", "CONFIGURATION_ERROR", "INTERNAL_ERROR"
    ]);
    const code = rawCode && known.has(rawCode)
        ? rawCode
        : response.status === 429 ? "RATE_LIMITED"
            : response.status === 401 ? "UNAUTHORIZED"
                : response.status === 403 ? "FORBIDDEN"
                    : response.status === 404 ? "NOT_FOUND"
                        : response.status >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST";
    const options = { status: response.status };
    if (body?.error?.retryable !== undefined)
        options.retryable = body.error.retryable;
    if (body?.error?.details !== undefined)
        options.details = body.error.details;
    return new PowerChainError(code, apiErrorMessage(body, fallback), options);
}
