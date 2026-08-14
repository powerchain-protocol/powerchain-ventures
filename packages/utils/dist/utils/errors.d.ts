export type PowerChainErrorCode = "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "NOT_ELIGIBLE" | "SALE_CLOSED" | "QUOTE_EXPIRED" | "RATE_LIMITED" | "RPC_UNAVAILABLE" | "TRANSACTION_REJECTED" | "TRANSACTION_FAILED" | "CONFIGURATION_ERROR" | "INTERNAL_ERROR";
export declare class PowerChainError extends Error {
    readonly code: PowerChainErrorCode;
    readonly status: number;
    readonly retryable: boolean;
    readonly details?: unknown;
    constructor(code: PowerChainErrorCode, message: string, options?: {
        status?: number;
        retryable?: boolean;
        details?: unknown;
        cause?: unknown;
    });
}
export declare function isPowerChainError(value: unknown): value is PowerChainError;
export declare function messageOf(value: unknown, fallback?: string): string;
export declare function errorCodeOf(value: unknown, fallback?: PowerChainErrorCode): PowerChainErrorCode;
export declare function normalizeError(value: unknown, fallback?: string): PowerChainError;
export type ApiErrorPayload = {
    ok?: false;
    error?: {
        code?: string;
        message?: string;
        retryable?: boolean;
        details?: unknown;
    };
    message?: string;
};
export declare function apiErrorMessage(payload: unknown, fallback?: string): string;
export declare function parseApiError(response: Response, fallback?: string): Promise<PowerChainError>;
