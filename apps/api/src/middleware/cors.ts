import cors from "cors";
import { AppError } from "../common/errors.js";
import { corsOrigins } from "../env/index.js";

export const corsMiddleware = cors({
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["content-type", "authorization", "x-request-id", "x-idempotency-key", "x-captcha-response"],
  exposedHeaders: ["x-request-id", "ratelimit", "ratelimit-policy"],
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError("cors_origin_denied", "This origin is not allowed to access the PowerChain API.", 403));
  }
});
