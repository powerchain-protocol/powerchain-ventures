import { createClient } from "@supabase/supabase-js";
import { mobileEnv } from "./env";
import { secureStorage } from "./storage";
export const supabase = createClient(mobileEnv.supabaseUrl, mobileEnv.supabasePublishableKey, { auth: { storage: secureStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, flowType: "pkce" } });
