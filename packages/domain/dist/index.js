export const POWERCHAIN_VERSION = "1.0.0";
export const SERVICE_FEE_BPS = 250n;
export const BPS_DENOMINATOR = 10000n;
export const PWRC_DECIMALS = 9;
export const PWRC_SYMBOL = "PWRC";
export function calculateServiceFee(amount, feeBps = SERVICE_FEE_BPS) {
    if (amount < 0n)
        throw new Error("amount must be non-negative");
    if (feeBps < 0n || feeBps > BPS_DENOMINATOR)
        throw new Error("invalid fee bps");
    return (amount * feeBps + BPS_DENOMINATOR - 1n) / BPS_DENOMINATOR;
}
export function buildQuote(input) {
    if (input.usdMicros <= 0n)
        throw new Error("purchase amount must be positive");
    if (input.priceUsdMicros <= 0n)
        throw new Error("token price must be positive");
    if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 18)
        throw new Error("invalid decimals");
    const scale = 10n ** BigInt(input.decimals);
    const tokenBaseUnits = (input.usdMicros * scale) / input.priceUsdMicros;
    if (tokenBaseUnits <= 0n)
        throw new Error("purchase amount too small");
    const serviceFeeUsdMicros = calculateServiceFee(input.usdMicros);
    return { tokenBaseUnits, serviceFeeUsdMicros, totalUsdMicros: input.usdMicros + serviceFeeUsdMicros };
}
export function resolveSalePhase(config, now = new Date()) {
    if (["completed", "cancelled"].includes(config.phase))
        return config.phase;
    const start = Date.parse(config.startsAt);
    const end = Date.parse(config.endsAt);
    const claim = Date.parse(config.claimStartsAt);
    if (![start, end, claim].every(Number.isFinite))
        throw new Error("sale timestamps must be valid ISO dates");
    if (!(start < end && end <= claim))
        throw new Error("sale timestamps are not ordered");
    const t = now.getTime();
    if (t < start)
        return "scheduled";
    if (t < end)
        return config.phase === "private" ? "private" : "public";
    if (t < claim)
        return "ended";
    return "claimable";
}
export function resolveActivationPhase(eligibility, startsAt, endsAt, now = new Date()) {
    const start = Date.parse(startsAt), end = Date.parse(endsAt), t = now.getTime();
    if (![start, end].every(Number.isFinite) || start >= end)
        throw new Error("invalid sale activation window");
    if (t >= end)
        throw new Error("sale already ended");
    if (t < start)
        return "scheduled";
    return eligibility === "public" ? "public" : "private";
}
export function validatePurchase(config, usdMicros, purchasedUsdMicros, now = new Date()) {
    const phase = resolveSalePhase(config, now);
    if (phase !== "public" && phase !== "private")
        throw new Error(`sale is ${phase}`);
    if (usdMicros < config.minPurchaseUsdMicros)
        throw new Error("below minimum purchase");
    if (purchasedUsdMicros + usdMicros > config.maxPurchaseUsdMicros)
        throw new Error("wallet purchase limit exceeded");
    return buildQuote({ usdMicros, priceUsdMicros: config.priceUsdMicros, decimals: config.decimals });
}
export function normalizeWalletList(rows) {
    const out = new Set();
    for (const raw of rows) {
        const value = raw.trim();
        if (!value)
            continue;
        if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value))
            throw new Error(`invalid Solana address: ${value}`);
        out.add(value);
    }
    return [...out];
}
export function vestedBaseUnits(schedule, now = new Date()) {
    if (schedule.totalBaseUnits < 0n || schedule.claimedBaseUnits < 0n || schedule.claimedBaseUnits > schedule.totalBaseUnits)
        throw new Error("invalid vesting amounts");
    const start = Date.parse(schedule.startsAt);
    const end = Date.parse(schedule.endsAt);
    const cliff = schedule.cliffAt ? Date.parse(schedule.cliffAt) : start;
    if (![start, end, cliff].every(Number.isFinite) || start > end || cliff < start || cliff > end)
        throw new Error("invalid vesting timestamps");
    const t = now.getTime();
    if (t < cliff)
        return 0n;
    if (t >= end || start === end)
        return schedule.totalBaseUnits;
    const elapsed = BigInt(Math.max(0, t - start));
    const duration = BigInt(end - start);
    return schedule.totalBaseUnits * elapsed / duration;
}
export function claimableBaseUnits(schedule, now = new Date()) {
    const vested = vestedBaseUnits(schedule, now);
    return vested > schedule.claimedBaseUnits ? vested - schedule.claimedBaseUnits : 0n;
}
export function assertAllocationAvailable(allocationBaseUnits, soldBaseUnits, requestedBaseUnits) {
    if (allocationBaseUnits <= 0n || soldBaseUnits < 0n || requestedBaseUnits <= 0n)
        throw new Error("invalid allocation amounts");
    if (soldBaseUnits > allocationBaseUnits || requestedBaseUnits > allocationBaseUnits - soldBaseUnits)
        throw new Error("sale allocation exceeded");
}
export function validateSaleTiming(startsAt, endsAt, claimStartsAt) {
    const start = Date.parse(startsAt);
    const end = Date.parse(endsAt);
    const claim = Date.parse(claimStartsAt);
    if (![start, end, claim].every(Number.isFinite))
        throw new Error("sale timestamps must be valid ISO dates");
    if (!(start < end))
        throw new Error("sale end must be after sale start");
    if (claim < end)
        throw new Error("claim start must be at or after sale end");
}
export function validateSaleEconomics(input) {
    if (input.priceUsdMicros <= 0n)
        throw new Error("token price must be positive");
    if (input.allocationBaseUnits <= 0n)
        throw new Error("sale allocation must be positive");
    if (input.minPurchaseUsdMicros <= 0n)
        throw new Error("minimum purchase must be positive");
    if (input.maxPurchaseUsdMicros < input.minPurchaseUsdMicros)
        throw new Error("maximum purchase must be at least the minimum");
}
export function assertTransactionReview(plan, now = new Date()) {
    const address = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!plan.id)
        throw new Error("transaction review id required");
    if (!address.test(plan.feePayer))
        throw new Error("invalid fee payer");
    if (!plan.instructions.length || plan.instructions.length > 64)
        throw new Error("transaction must contain 1-64 instructions");
    if (plan.fees.networkFeeLamports < 0n || plan.fees.serviceFeeLamports < 0n || plan.fees.rentLamports < 0n)
        throw new Error("fees must be non-negative");
    if (plan.fees.totalLamports !== plan.fees.networkFeeLamports + plan.fees.serviceFeeLamports + plan.fees.rentLamports)
        throw new Error("transaction fee total mismatch");
    for (let i = 0; i < plan.instructions.length; i++) {
        const instruction = plan.instructions[i];
        if (instruction.index !== i)
            throw new Error("instruction indexes must be contiguous and ordered");
        if (!address.test(instruction.programId))
            throw new Error("invalid instruction program id");
        if (!instruction.summary.trim())
            throw new Error("instruction summary required");
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(instruction.dataBase64))
            throw new Error("invalid instruction data encoding");
        for (const account of instruction.accounts)
            if (!address.test(account.address))
                throw new Error("invalid instruction account");
    }
    for (const recipient of plan.recipients)
        if (!address.test(recipient.address))
            throw new Error("invalid recipient address");
    if (plan.serializedTransactionBase64 && !/^[A-Za-z0-9+/]+={0,2}$/.test(plan.serializedTransactionBase64))
        throw new Error("invalid serialized transaction encoding");
    if (plan.expiresAt) {
        const expiry = Date.parse(plan.expiresAt);
        if (!Number.isFinite(expiry))
            throw new Error("invalid transaction expiry");
        if (expiry <= now.getTime())
            throw new Error("transaction review expired");
    }
}
