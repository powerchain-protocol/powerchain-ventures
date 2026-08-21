import { z } from "zod";
import bs58 from "bs58";

export const solanaAddressSchema = z.string().trim().min(32).max(44).refine((value) => {
  try { return bs58.decode(value).length === 32; } catch { return false; }
}, "Invalid Solana public key");
export const uuidSchema = z.string().uuid();
export const slugSchema = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
