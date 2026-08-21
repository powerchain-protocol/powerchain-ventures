import { rateLimit } from "express-rate-limit";

function jsonHandler(_req: import("express").Request, res: import("express").Response) {
  return res.status(429).json({ error: { code: "rate_limit_exceeded", message: "Too many requests. Retry after the current rate-limit window." } });
}

export const generalRateLimit = rateLimit({ windowMs: 60_000, limit: 240, standardHeaders: "draft-8", legacyHeaders: false, handler: jsonHandler });
export const writeRateLimit = rateLimit({
  windowMs: 60_000, limit: 40, standardHeaders: "draft-8", legacyHeaders: false, handler: jsonHandler,
  skip: (req) => !["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
});
export const marketRateLimit = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false, handler: jsonHandler });
