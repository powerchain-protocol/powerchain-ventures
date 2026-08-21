import { z } from "zod";
export const updateProfileSchema = z.object({ name: z.string().trim().min(2).max(80), image: z.string().url().max(1000).nullable().optional() });
export const updateSettingsSchema = z.object({ emailAlerts: z.boolean(), launchAlerts: z.boolean(), transactionAlerts: z.boolean(), marketAlerts: z.boolean(), timezone: z.string().min(1).max(80) });
