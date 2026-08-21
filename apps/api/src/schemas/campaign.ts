import { z } from "zod";
import bs58 from "bs58";
import { slugSchema, solanaAddressSchema } from "./common.js";

const isoDate = z.string().datetime({ offset: true });

export const campaignDraftSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: slugSchema,
  description: z.string().trim().min(20).max(4000),
  category: z.string().trim().min(2).max(80),
  tokenMint: solanaAddressSchema,
  treasuryWallet: solanaAddressSchema,
  targetAmount: z.coerce.number().positive().max(1_000_000_000),
  settlementAsset: z.enum(["USDC", "SOL"]).default("USDC"),
  phase: z.object({
    name: z.string().trim().min(2).max(80).default("Public Sale"),
    price: z.coerce.number().positive().max(1_000_000),
    allocation: z.coerce.number().positive().max(1_000_000_000_000),
    minContribution: z.coerce.number().positive().optional(),
    maxContribution: z.coerce.number().positive().optional(),
    startsAt: isoDate.optional(),
    endsAt: isoDate.optional()
  }).superRefine((value, ctx) => {
    if (value.minContribution && value.maxContribution && value.minContribution > value.maxContribution) {
      ctx.addIssue({ code: "custom", path: ["maxContribution"], message: "Maximum contribution must be greater than or equal to the minimum." });
    }
    if (value.startsAt && value.endsAt && new Date(value.startsAt).getTime() >= new Date(value.endsAt).getTime()) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "Sale end must be after the sale start." });
    }
  })
});

export const prepareLaunchSchema = z.object({ authority: solanaAddressSchema, simulate: z.boolean().default(true) });
export const confirmLaunchSchema = z.object({
  reviewId: z.string().uuid(),
  signature: z.string().min(64).max(128).refine((value) => {
    try { return bs58.decode(value).length === 64; } catch { return false; }
  }, "Invalid Solana transaction signature"),
  authority: solanaAddressSchema
});
