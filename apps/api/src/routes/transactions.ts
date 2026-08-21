import { Router } from "express";
import { z } from "zod";
import { badRequest, ok } from "../common/response.js";
import { simulateTransactionBase64 } from "../services/transaction-service.js";
export const transactionsRouter = Router();
const schema = z.object({ transactionBase64: z.string().min(1).max(750000).regex(/^[A-Za-z0-9+/]+={0,2}$/, "transactionBase64 must be standard base64").optional() });
transactionsRouter.post("/simulate", async (req, res, next) => { try { const parsed = schema.safeParse(req.body ?? {}); if (!parsed.success) return badRequest(res, "invalid_request", parsed.error.issues); return ok(res, await simulateTransactionBase64(parsed.data.transactionBase64)); } catch (error) { next(error); } });
