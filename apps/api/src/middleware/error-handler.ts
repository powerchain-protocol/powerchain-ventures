import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../common/errors.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { code: "route_not_found", message: `No route for ${req.method} ${req.path}` }, requestId: req.requestId });
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ error: { code: "invalid_request", message: "Request validation failed", issues: error.issues }, requestId: req.requestId });
  if (error instanceof AppError) return res.status(error.status).json({ error: { code: error.code, message: error.message }, requestId: req.requestId });
  console.error("request_failed", { requestId: req.requestId, error });
  return res.status(500).json({ error: { code: "internal_error", message: "The request could not be completed." }, requestId: req.requestId });
}
