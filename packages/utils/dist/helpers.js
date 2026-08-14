const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const UINT = /^\d+$/;
export function isSolanaAddress(value) {
    return typeof value === "string" && SOLANA_ADDRESS.test(value.trim());
}
export function isUuid(value) {
    return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function asUint(value, field = "value") {
    if (typeof value !== "string" || !UINT.test(value))
        throw new TypeError(`${field} must be an unsigned integer string`);
    return BigInt(value);
}
export function asPositiveUint(value, field = "value") {
    const parsed = asUint(value, field);
    if (parsed <= 0n)
        throw new RangeError(`${field} must be positive`);
    return parsed;
}
export function clampInteger(value, min, max) {
    if (!Number.isFinite(value))
        return min;
    return Math.min(max, Math.max(min, Math.trunc(value)));
}
export function parseCsvList(value) {
    if (!value)
        return [];
    return [...new Set(value.split(",").map(v => v.trim()).filter(Boolean))];
}
export function normalizeOrigin(value) {
    return value.trim().replace(/\/+$/, "");
}
export function safeExternalUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    }
    catch {
        return null;
    }
}
export function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted)
            return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        const timer = setTimeout(resolve, Math.max(0, ms));
        signal?.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        }, { once: true });
    });
}
export function shortAddress(value, head = 4, tail = 4) {
    if (value.length <= head + tail + 1)
        return value;
    return `${value.slice(0, head)}…${value.slice(-tail)}`;
}
export function formatBaseUnits(value, decimals, maxFractionDigits = decimals) {
    const amount = typeof value === "bigint" ? value : asUint(value, "amount");
    const d = clampInteger(decimals, 0, 18);
    const m = clampInteger(maxFractionDigits, 0, d);
    if (d === 0)
        return amount.toString();
    const scale = 10n ** BigInt(d);
    const whole = amount / scale;
    const fraction = (amount % scale).toString().padStart(d, "0").slice(0, m).replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : whole.toString();
}
export function withTimeout(promise, timeoutMs, label = "operation") {
    const ms = clampInteger(timeoutMs, 1, 120_000);
    let timer;
    return Promise.race([
        promise.finally(() => { if (timer)
            clearTimeout(timer); }),
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`${label}_timeout`)), ms);
        })
    ]);
}
const SOLANA_SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
/** Valid base58 wallet-style address that is not the System Program placeholder. */
export function isUsableSolanaWalletAddress(value) {
    return isSolanaAddress(value) && value.trim() !== SOLANA_SYSTEM_PROGRAM_ID;
}
export function requireUsableSolanaWalletAddress(value, field = "wallet") {
    if (!isUsableSolanaWalletAddress(value))
        throw new TypeError(`${field} must be a configured Solana wallet address`);
    return value.trim();
}
/** Safe boolean for UI/config status without exposing the underlying secret value. */
export function isConfiguredSecret(value, minLength = 20) {
    return typeof value === "string" && value.trim().length >= minLength;
}
/** Redact credentials before structured logging. Public addresses should not use this helper. */
export function redactSecret(value) {
    if (!value)
        return null;
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    if (trimmed.length <= 8)
        return "***";
    return `${trimmed.slice(0, 3)}…${trimmed.slice(-3)}`;
}
