import { Router } from "express";
import { z } from "zod";
import { ok, badRequest } from "../../common/response.js";
import { env } from "../../env/index.js";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type PowerChainAuthSession } from "../../middleware/auth-session.js";
import { launchRepository } from "../../repositories/launch-repository.js";

export const lifecycleRouter = Router();
const listQuery = z.object({ launchId: z.string().min(1), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(25) });
const walletQuery = listQuery.extend({ wallet: z.string().min(32).max(64).optional() });

async function authorize(res: import("express").Response, launchId: string) {
  const auth = res.locals.auth as PowerChainAuthSession;
  return launchRepository.canManage(launchId, auth.user.id);
}
function denied(res: import("express").Response) {
  return res.status(403).json({ error: { code: "launch_management_denied", message: "You are not authorized to inspect this launch lifecycle." } });
}

lifecycleRouter.use(requireAuth);

lifecycleRouter.get("/participants", async (req,res,next)=>{try{const parsed=listQuery.safeParse(req.query);if(!parsed.success)return badRequest(res,"invalid_query",parsed.error.issues);if(!await authorize(res,parsed.data.launchId))return denied(res);if(env.POWERCHAIN_DATA_MODE==="mock")return ok(res,[],{page:parsed.data.page,limit:parsed.data.limit,total:0});const {launchId,page,limit}=parsed.data;const where={launchId};const [rows,total]=await Promise.all([prisma.participation.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*limit,take:limit}),prisma.participation.count({where})]);return ok(res,rows,{page,limit,total})}catch(error){next(error)}});
lifecycleRouter.get("/claims",async(req,res,next)=>{try{const parsed=walletQuery.safeParse(req.query);if(!parsed.success)return badRequest(res,"invalid_query",parsed.error.issues);if(!await authorize(res,parsed.data.launchId))return denied(res);if(env.POWERCHAIN_DATA_MODE==="mock")return ok(res,[],{page:parsed.data.page,limit:parsed.data.limit,total:0});const {launchId,wallet,page,limit}=parsed.data;const where={launchId,...(wallet?{walletAddress:wallet}:{})};const [rows,total]=await Promise.all([prisma.claim.findMany({where,orderBy:{unlockAt:"asc"},skip:(page-1)*limit,take:limit}),prisma.claim.count({where})]);return ok(res,rows,{page,limit,total})}catch(error){next(error)}});
lifecycleRouter.get("/settlements",async(req,res,next)=>{try{const parsed=listQuery.safeParse(req.query);if(!parsed.success)return badRequest(res,"invalid_query",parsed.error.issues);if(!await authorize(res,parsed.data.launchId))return denied(res);if(env.POWERCHAIN_DATA_MODE==="mock")return ok(res,[],{page:parsed.data.page,limit:parsed.data.limit,total:0});const {launchId,page,limit}=parsed.data;const where={launchId};const [rows,total]=await Promise.all([prisma.settlement.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*limit,take:limit}),prisma.settlement.count({where})]);return ok(res,rows,{page,limit,total})}catch(error){next(error)}});
lifecycleRouter.get("/activity",async(req,res,next)=>{try{const parsed=listQuery.safeParse(req.query);if(!parsed.success)return badRequest(res,"invalid_query",parsed.error.issues);if(!await authorize(res,parsed.data.launchId))return denied(res);if(env.POWERCHAIN_DATA_MODE==="mock")return ok(res,[],{page:parsed.data.page,limit:parsed.data.limit,total:0});const {launchId,page,limit}=parsed.data;const where={launchId};const [rows,total]=await Promise.all([prisma.auditEvent.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*limit,take:limit}),prisma.auditEvent.count({where})]);return ok(res,rows,{page,limit,total})}catch(error){next(error)}});
