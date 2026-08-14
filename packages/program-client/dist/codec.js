import { createHash } from "node:crypto";
export const PROGRAM_INSTRUCTION_TAG = {
    initializeSale: 0,
    updateTiming: 1,
    setPaused: 2,
    purchase: 3,
    claim: 4,
    cancelSale: 5,
    completeSale: 6,
    adoptVaultAuthority: 7,
};
class Writer {
    chunks = [];
    u8(value) { if (!Number.isInteger(value) || value < 0 || value > 255)
        throw new Error("u8_out_of_range"); this.chunks.push(Buffer.from([value])); return this; }
    bool(value) { return this.u8(value ? 1 : 0); }
    u64(value) { const n = BigInt(value); if (n < 0n || n > 0xffffffffffffffffn)
        throw new Error("u64_out_of_range"); const b = Buffer.alloc(8); b.writeBigUInt64LE(n); this.chunks.push(b); return this; }
    i64(value) { const n = BigInt(value); if (n < -(1n << 63n) || n > ((1n << 63n) - 1n))
        throw new Error("i64_out_of_range"); const b = Buffer.alloc(8); b.writeBigInt64LE(n); this.chunks.push(b); return this; }
    bytes32(value) { if (value.byteLength !== 32)
        throw new Error("bytes32_required"); this.chunks.push(Buffer.from(value)); return this; }
    finish() { return Buffer.concat(this.chunks); }
}
export function saleSeedFromId(saleId) {
    if (!/^[0-9a-f-]{36}$/i.test(saleId))
        throw new Error("invalid_sale_id");
    return createHash("sha256").update(`powerchain:launchpad:sale:${saleId}`, "utf8").digest();
}
export function encodeInitializeSale(a) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG.initializeSale).bytes32(a.saleSeed).u8(a.decimals).u8(a.eligibility).bool(a.vestingEnabled).bool(a.deliveryOnClaim).bytes32(a.quoteAuthority).i64(a.startsAt).i64(a.endsAt).i64(a.claimStartsAt).i64(a.vestingCliffAt).i64(a.vestingEndsAt).u64(a.allocationBaseUnits).u64(a.priceUsdMicros).u64(a.minPurchaseUsdMicros).u64(a.maxPurchaseUsdMicros).finish(); }
export function encodeUpdateTiming(a) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG.updateTiming).i64(a.startsAt).i64(a.endsAt).i64(a.claimStartsAt).i64(a.vestingCliffAt).i64(a.vestingEndsAt).finish(); }
export function encodeSetPaused(paused) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG.setPaused).bool(paused).finish(); }
export function encodePurchase(a) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG.purchase).u64(a.tokenAmountBaseUnits).u64(a.paymentLamports).u64(a.serviceFeeLamports).u64(a.purchaseNonce).finish(); }
export function encodeClaim(amountBaseUnits) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG.claim).u64(amountBaseUnits).finish(); }
export function encodeNoArgs(name) { return new Writer().u8(PROGRAM_INSTRUCTION_TAG[name]).finish(); }
