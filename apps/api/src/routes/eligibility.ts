import { Router } from "express";
import { eligibilitySchema } from "../schemas/launch.js";
import { badRequest, ok } from "../common/response.js";
export const eligibilityRouter = Router();
eligibilityRouter.post("/check", (req, res) => { const parsed = eligibilitySchema.safeParse(req.body); if (!parsed.success) return badRequest(res, "invalid_request", parsed.error.issues); return ok(res, { eligible: true, wallet: parsed.data.wallet, launchId: parsed.data.launchId, reason: "public_phase" }); });
