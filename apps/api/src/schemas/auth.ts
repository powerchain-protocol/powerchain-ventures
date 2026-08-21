import { z } from "zod";
export const walletChallengeSchema = z.object({ wallet: z.string().min(32).max(44) });
export const walletVerifySchema = z.object({ wallet: z.string().min(32).max(44), message: z.string().min(1).max(2000), signature: z.string().min(64).max(256) });
