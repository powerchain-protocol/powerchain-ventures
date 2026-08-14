export declare function createRequestId(prefix?: string): string;
export declare function createIdempotencyKey(scope?: string): string;
export declare function parseRetryAfterMs(value: string | null, now?: number): number | null;
export declare function retryDelayMs(attempt: number, retryAfterMs?: number | null): number;
export interface FetchJsonOptions extends RequestInit {
    timeoutMs?: number;
    retries?: number;
    fallbackMessage?: string;
    requestId?: string;
    idempotencyKey?: string;
}
export declare function fetchJsonWithPolicy<T>(input: RequestInfo | URL, options?: FetchJsonOptions): Promise<T>;
