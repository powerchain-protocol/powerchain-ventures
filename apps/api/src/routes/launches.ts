import { Router, type Response } from "express";
import { createLaunchSchema } from "../schemas/launch.js";
import { launchRepository } from "../repositories/launch-repository.js";
import { buildReadiness } from "../services/readiness-service.js";
import { getLaunchAuthorities, getLaunchHealth, getLaunchOperationsOverview, getLaunchTimeline, getLaunchTreasury } from "../services/launch-operations-service.js";
import { badRequest, notFound, ok } from "../common/response.js";
import { requireAuth, type PowerChainAuthSession } from "../middleware/auth-session.js";

export const launchesRouter = Router();

launchesRouter.get("/", async (_req, res, next) => {
  try { return ok(res, await launchRepository.list()); } catch (error) { next(error); }
});

launchesRouter.get("/:id/readiness", async (req, res, next) => {
  try {
    const launch = await launchRepository.findById(req.params.id);
    if (!launch) return notFound(res, "launch_not_found");
    return ok(res, await buildReadiness(launch.id));
  } catch (error) { next(error); }
});

launchesRouter.get("/:id/health", async (req, res, next) => {
  try {
    const launch = await launchRepository.findById(req.params.id);
    if (!launch) return notFound(res, "launch_not_found");
    return ok(res, await getLaunchHealth(launch.id));
  } catch (error) { next(error); }
});

launchesRouter.get("/:id", async (req, res, next) => {
  try {
    const launch = await launchRepository.findById(req.params.id);
    if (!launch) return notFound(res, "launch_not_found");
    return ok(res, launch);
  } catch (error) { next(error); }
});

launchesRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = createLaunchSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, "invalid_request", parsed.error.issues);
    const auth = res.locals.auth as PowerChainAuthSession;
    const launch = await launchRepository.create({ ...parsed.data, creatorId: auth.user.id });
    return res.status(201).json({ data: launch, requestId: req.requestId });
  } catch (error) { next(error); }
});

async function canManage(res: Response, launchId: string) {
  const auth = res.locals.auth as PowerChainAuthSession;
  return launchRepository.canManage(launchId, auth.user.id);
}
function denied(res: Response) {
  return res.status(403).json({ error: { code: "launch_management_denied", message: "You are not authorized to inspect this launch control plane." }, requestId: res.req.requestId });
}

launchesRouter.get("/:id/overview", requireAuth, async (req, res, next) => {
  try {
    if (!await canManage(res, req.params.id)) return denied(res);
    return ok(res, await getLaunchOperationsOverview(req.params.id));
  } catch (error) { next(error); }
});
launchesRouter.get("/:id/timeline", requireAuth, async (req, res, next) => {
  try {
    if (!await canManage(res, req.params.id)) return denied(res);
    return ok(res, await getLaunchTimeline(req.params.id));
  } catch (error) { next(error); }
});
launchesRouter.get("/:id/treasury", requireAuth, async (req, res, next) => {
  try {
    if (!await canManage(res, req.params.id)) return denied(res);
    return ok(res, await getLaunchTreasury(req.params.id));
  } catch (error) { next(error); }
});
launchesRouter.get("/:id/authorities", requireAuth, async (req, res, next) => {
  try {
    if (!await canManage(res, req.params.id)) return denied(res);
    return ok(res, await getLaunchAuthorities(req.params.id));
  } catch (error) { next(error); }
});
