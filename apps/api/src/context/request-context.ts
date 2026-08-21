import type { NextFunction, Request, Response } from "express";
import { createId } from "../common/ids.js";

declare global {
  namespace Express {
    interface Request { requestId?: string; }
  }
}

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const inbound = req.header("x-request-id")?.trim();
  const requestId = inbound && inbound.length <= 128 ? inbound : createId();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
