import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { captcha } from "better-auth/plugins";
import { prisma } from "../lib/prisma.js";
import { authTrustedOrigins, env } from "../lib/env.js";

const turnstilePlugin = env.TURNSTILE_SECRET_KEY
  ? [captcha({ provider: "cloudflare-turnstile", secretKey: env.TURNSTILE_SECRET_KEY })]
  : [];

export const auth = betterAuth({
  appName: "PowerChain Ventures",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: authTrustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 12,
    freshAge: 60 * 10,
    cookieCache: {
      enabled: true,
      maxAge: 60,
      strategy: "compact"
    }
  },
  advanced: {
    cookiePrefix: "powerchain",
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production"
    },
    ...(env.AUTH_COOKIE_DOMAIN ? {
      crossSubDomainCookies: {
        enabled: true,
        domain: env.AUTH_COOKIE_DOMAIN
      }
    } : {}),
    database: {
      generateId: "uuid",
      joins: true
    },
    ipAddress: {
      ...(env.TRUST_CLOUDFLARE_PROXY ? { ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"] } : {}),
      disableIpTracking: !env.TRUST_CLOUDFLARE_PROXY
    }
  },
  plugins: turnstilePlugin,
  telemetry: { enabled: false }
});
