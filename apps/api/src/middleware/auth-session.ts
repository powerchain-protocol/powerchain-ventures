import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.js";
import { AppError } from "../common/errors.js";

export type PowerChainAuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export async function getRequestSession(req: Request) {
  return auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await getRequestSession(req);
    if (!session) return next(new AppError("authentication_required", "Sign in to continue.", 401));
    res.locals.auth = session;
    return next();
  } catch (error) {
    return next(error);
  }
}
