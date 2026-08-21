import { Router } from "express";
import { badRequest, ok } from "../common/response.js";
import { requireAuth, type PowerChainAuthSession } from "../middleware/auth-session.js";
import { updateProfileSchema, updateSettingsSchema } from "../schemas/account.js";
import { prisma } from "../lib/prisma.js";

export const accountRouter = Router();

accountRouter.get("/me", requireAuth, (_req, res) => {
  const auth = res.locals.auth as PowerChainAuthSession;
  return ok(res, { user: { id: auth.user.id, name: auth.user.name, email: auth.user.email, emailVerified: auth.user.emailVerified, image: auth.user.image ?? null }, session: { id: auth.session.id, createdAt: auth.session.createdAt, updatedAt: auth.session.updatedAt, expiresAt: auth.session.expiresAt } });
});

accountRouter.patch("/profile", requireAuth, async (req, res, next) => {
  try { const parsed=updateProfileSchema.safeParse(req.body); if(!parsed.success)return badRequest(res,"invalid_profile",parsed.error.issues); const auth=res.locals.auth as PowerChainAuthSession; const user=await prisma.user.update({where:{id:auth.user.id},data:parsed.data}); return ok(res,{id:user.id,name:user.name,email:user.email,image:user.image}); } catch(error){next(error)}
});

accountRouter.get("/settings", requireAuth, async (_req,res,next)=>{try{const auth=res.locals.auth as PowerChainAuthSession;const settings=await prisma.userPreference.upsert({where:{userId:auth.user.id},update:{},create:{userId:auth.user.id}});return ok(res,settings)}catch(error){next(error)}});
accountRouter.patch("/settings", requireAuth, async (req,res,next)=>{try{const parsed=updateSettingsSchema.safeParse(req.body);if(!parsed.success)return badRequest(res,"invalid_settings",parsed.error.issues);const auth=res.locals.auth as PowerChainAuthSession;const settings=await prisma.userPreference.upsert({where:{userId:auth.user.id},update:parsed.data,create:{userId:auth.user.id,...parsed.data}});return ok(res,settings)}catch(error){next(error)}});
