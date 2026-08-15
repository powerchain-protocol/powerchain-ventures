import { json } from "../../../../../lib/http";
import {
  betterAuthEnabled,
  configuredSocialProviders,
} from "../../../../../lib/better-auth";

export async function GET() {
  return json({
    ok: true,
    auth: {
      engine: betterAuthEnabled
        ? "better-auth"
        : "legacy",
      emailPassword: betterAuthEnabled,
      wallet: true,
      socialProviders:
        configuredSocialProviders(),
      embeddedWallets:
        process.env.EMBEDDED_WALLET_PROVIDER?.trim() ||
        "disabled",
    },
  });
}
