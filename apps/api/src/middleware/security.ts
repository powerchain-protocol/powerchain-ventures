import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import { assertNoSecrets } from "../common/utils/safe-actions.js";

export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
  referrerPolicy: { policy: "no-referrer" }
});

export function rejectSecretMaterial(req: Request, _res: Response, next: NextFunction) {
  try { if (req.body) assertNoSecrets(req.body); next(); } catch (error) { next(error); }
}
