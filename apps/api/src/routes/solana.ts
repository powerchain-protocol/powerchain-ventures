import { Router } from "express";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { rateLimit } from "express-rate-limit";
import { ok, badRequest } from "../common/response.js";
import { getAsset, getAssetsByOwner, getTransactionsForAddress, getTransfersByAddress } from "../lib/helius.js";
import { solanaRpcInfo, withRpcFallback } from "../lib/solana-rpc.js";

export const solanaRouter = Router();

solanaRouter.use(rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

function validAddress(value: string) {
  try { return new PublicKey(value).toBase58() === value; } catch { return false; }
}

solanaRouter.get("/status", async (_req, res, next) => {
  try {
    const latest = await withRpcFallback((connection) => connection.getLatestBlockhash("confirmed"));
    return ok(res, { ...solanaRpcInfo(), reachable: true, lastValidBlockHeight: latest.lastValidBlockHeight });
  } catch (error) { return next(error); }
});

solanaRouter.get("/wallets/:address/balance", async (req, res, next) => {
  try {
    if (!validAddress(req.params.address)) return badRequest(res, "invalid_solana_address", undefined, "Wallet address is not a valid Solana public key.");
    const publicKey = new PublicKey(req.params.address);
    const lamports = await withRpcFallback((connection) => connection.getBalance(publicKey, "confirmed"));
    return ok(res, { address: req.params.address, lamports, sol: lamports / LAMPORTS_PER_SOL, ...solanaRpcInfo() });
  } catch (error) { return next(error); }
});

solanaRouter.get("/wallets/:address/assets", async (req, res, next) => {
  try {
    if (!validAddress(req.params.address)) return badRequest(res, "invalid_solana_address", undefined, "Wallet address is not a valid Solana public key.");
    const page = Math.max(Number(req.query.page || 1) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 100) || 100, 1), 1000);
    return ok(res, await getAssetsByOwner(req.params.address, page, limit));
  } catch (error) { return next(error); }
});

solanaRouter.get("/wallets/:address/transactions", async (req, res, next) => {
  try {
    if (!validAddress(req.params.address)) return badRequest(res, "invalid_solana_address", undefined, "Wallet address is not a valid Solana public key.");
    const full = req.query.full === "true";
    const limit = Math.min(Math.max(Number(req.query.limit || 50) || 50, 1), full ? 100 : 1000);
    const paginationToken = typeof req.query.paginationToken === "string" ? req.query.paginationToken : undefined;
    return ok(res, await getTransactionsForAddress(req.params.address, { limit, full, paginationToken }));
  } catch (error) { return next(error); }
});

solanaRouter.get("/wallets/:address/transfers", async (req, res, next) => {
  try {
    if (!validAddress(req.params.address)) return badRequest(res, "invalid_solana_address", undefined, "Wallet address is not a valid Solana public key.");
    const limit = Math.min(Math.max(Number(req.query.limit || 50) || 50, 1), 100);
    const paginationToken = typeof req.query.paginationToken === "string" ? req.query.paginationToken : undefined;
    const directionParam = typeof req.query.direction === "string" ? req.query.direction : undefined;
    if (directionParam && !["in", "out", "any"].includes(directionParam)) return badRequest(res, "invalid_direction", undefined, "direction must be in, out, or any.");
    const direction = (directionParam || "any") as "in" | "out" | "any";
    const mintParam = typeof req.query.mint === "string" ? req.query.mint : undefined;
    if (mintParam && !validAddress(mintParam)) return badRequest(res, "invalid_mint", undefined, "mint must be a valid Solana public key.");
    const counterpartyParam = typeof req.query.with === "string" ? req.query.with : undefined;
    if (counterpartyParam && !validAddress(counterpartyParam)) return badRequest(res, "invalid_counterparty", undefined, "with must be a valid Solana public key.");
    const solModeParam = typeof req.query.solMode === "string" ? req.query.solMode : undefined;
    if (solModeParam && !["merged", "separate"].includes(solModeParam)) return badRequest(res, "invalid_sol_mode", undefined, "solMode must be merged or separate.");
    const solMode = (solModeParam || "merged") as "merged" | "separate";
    return ok(res, await getTransfersByAddress(req.params.address, { limit, paginationToken, direction, mint: mintParam, counterparty: counterpartyParam, solMode }));
  } catch (error) { return next(error); }
});

solanaRouter.get("/assets/:assetId", async (req, res, next) => {
  try {
    if (!validAddress(req.params.assetId)) return badRequest(res, "invalid_asset_id", undefined, "Asset id is not a valid Solana public key.");
    return ok(res, await getAsset(req.params.assetId));
  } catch (error) { return next(error); }
});
