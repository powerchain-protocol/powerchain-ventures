import { z } from "zod";
import { slugSchema, solanaAddressSchema } from "./common.js";

export const eligibilitySchema = z.object({ wallet: solanaAddressSchema, launchId: z.string().min(1) });
export const createLaunchSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: slugSchema,
  description: z.string().trim().max(4000).optional(),
  category: z.string().trim().max(80).optional(),
  tokenMint: solanaAddressSchema.optional(),
  treasuryWallet: solanaAddressSchema.optional(),
  targetAmount: z.coerce.number().positive().optional(),
  settlementAsset: z.enum(["USDC", "SOL"]).default("USDC")
});
