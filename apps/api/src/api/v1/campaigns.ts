import { Router } from "express";
import { campaignDraftSchema, confirmLaunchSchema, prepareLaunchSchema } from "../../schemas/campaign.js";
import { launchRepository } from "../../repositories/launch-repository.js";
import { requireAuth, type PowerChainAuthSession } from "../../middleware/auth-session.js";
import { badRequest, notFound, ok } from "../../common/response.js";
import { buildReadiness } from "../../services/readiness-service.js";
import { confirmCampaignLaunch, prepareCampaignLaunch } from "../../services/campaign-service.js";
import { assertNoSecrets } from "../../common/utils/safe-actions.js";
import { publishLaunchEvent } from "../../websocket/server.js";

export const campaignsRouter = Router();

campaignsRouter.get("/", async (_req, res, next) => { try { return ok(res, await launchRepository.list()); } catch (error) { next(error); } });
campaignsRouter.get("/:id", async (req, res, next) => { try { const launch = await launchRepository.findById(req.params.id); return launch ? ok(res, launch) : notFound(res, "campaign_not_found"); } catch (error) { next(error); } });
campaignsRouter.get("/:id/readiness", async (req, res, next) => { try { const launch = await launchRepository.findById(req.params.id); return launch ? ok(res, await buildReadiness(launch.id)) : notFound(res, "campaign_not_found"); } catch (error) { next(error); } });

campaignsRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    assertNoSecrets(req.body);
    const parsed = campaignDraftSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, "invalid_campaign", parsed.error.issues);
    const auth = res.locals.auth as PowerChainAuthSession;
    const launch = await launchRepository.create({ ...parsed.data, creatorId: auth.user.id });
    publishLaunchEvent(launch.id, { type: "campaign.created", data: { status: launch.status, name: launch.name } });
    return res.status(201).json({ data: launch });
  } catch (error) { next(error); }
});

campaignsRouter.post("/:id/prepare-launch", requireAuth, async (req, res, next) => {
  try {
    assertNoSecrets(req.body);
    const parsed = prepareLaunchSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, "invalid_request", parsed.error.issues);
    const auth = res.locals.auth as PowerChainAuthSession;
    if (!await launchRepository.canManage(req.params.id, auth.user.id)) return res.status(403).json({ error: { code: "launch_management_denied", message: "You are not authorized to manage this launch." } });
    return ok(res, await prepareCampaignLaunch(req.params.id, parsed.data.authority, parsed.data.simulate));
  } catch (error) { next(error); }
});

campaignsRouter.post("/:id/confirm-launch", requireAuth, async (req, res, next) => {
  try {
    const parsed = confirmLaunchSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, "invalid_request", parsed.error.issues);
    const auth = res.locals.auth as PowerChainAuthSession;
    if (!await launchRepository.canManage(req.params.id, auth.user.id)) return res.status(403).json({ error: { code: "launch_management_denied", message: "You are not authorized to manage this launch." } });
    const launch = await confirmCampaignLaunch(req.params.id, parsed.data.reviewId, parsed.data.signature, parsed.data.authority);
    if (launch) publishLaunchEvent(launch.id, { type: "campaign.live", data: { signature: parsed.data.signature } });
    return launch ? ok(res, launch) : notFound(res, "campaign_not_found");
  } catch (error) { next(error); }
});
