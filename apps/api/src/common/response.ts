import type { Response } from "express";

function requestId(res: Response) { return res.req.requestId; }

export function ok<T>(res: Response, data: T, meta?: Record<string, unknown>) {
  return res.json({ data, ...(meta ? { meta } : {}), requestId: requestId(res) });
}

export function badRequest(res: Response, code: string, issues?: unknown, message = "The request is invalid.") {
  return res.status(400).json({ error: { code, message, ...(issues ? { issues } : {}) }, requestId: requestId(res) });
}

export function notFound(res: Response, code = "not_found", message = "The requested resource was not found.") {
  return res.status(404).json({ error: { code, message }, requestId: requestId(res) });
}
