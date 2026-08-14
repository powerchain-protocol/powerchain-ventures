export declare function isSolanaAddress(value: unknown): value is string;
export declare function isUuid(value: unknown): value is string;
export declare function asUint(value: unknown, field?: string): bigint;
export declare function asPositiveUint(value: unknown, field?: string): bigint;
export declare function clampInteger(value: number, min: number, max: number): number;
export declare function parseCsvList(value: string | undefined | null): string[];
export declare function normalizeOrigin(value: string): string;
export declare function safeExternalUrl(value: string): URL | null;
export declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
export declare function shortAddress(value: string, head?: number, tail?: number): string;
export declare function formatBaseUnits(value: string | bigint, decimals: number, maxFractionDigits?: number): string;
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label?: string): Promise<T>;
/** Valid base58 wallet-style address that is not the System Program placeholder. */
export declare function isUsableSolanaWalletAddress(value: unknown): value is string;
export declare function requireUsableSolanaWalletAddress(value: unknown, field?: string): string;
/** Safe boolean for UI/config status without exposing the underlying secret value. */
export declare function isConfiguredSecret(value: unknown, minLength?: number): boolean;
/** Redact credentials before structured logging. Public addresses should not use this helper. */
export declare function redactSecret(value: string | undefined | null): string | null;
