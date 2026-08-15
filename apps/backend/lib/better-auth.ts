import { betterAuth } from "better-auth";
import { Pool } from "pg";
import {
  renderAuthEmail,
  type AuthEmailData,
} from "@powerchain/mail";
import { sendRenderedMail } from "./mail-service";

const databaseUrl = process.env.DATABASE_URL?.trim();

const effectiveDatabaseUrl =
  databaseUrl ||
  "postgresql://powerchain:powerchain@127.0.0.1:5432/powerchain";

export const authPool = new Pool({
  connectionString: effectiveDatabaseUrl,
  max: Number(process.env.AUTH_DB_POOL_SIZE ?? 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

const configuredSecret =
  process.env.BETTER_AUTH_SECRET?.trim();

const effectiveSecret =
  configuredSecret ||
  "powerchain-build-only-auth-secret-do-not-use-in-production-000000000001";

function provider(
  clientId: string | undefined,
  clientSecret: string | undefined,
) {
  const id = clientId?.trim();
  const secret = clientSecret?.trim();
  return id && secret
    ? { clientId: id, clientSecret: secret }
    : undefined;
}

const google = provider(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
const github = provider(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
);
const discord = provider(
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_CLIENT_SECRET,
);
const apple = provider(
  process.env.APPLE_CLIENT_ID,
  process.env.APPLE_CLIENT_SECRET,
);

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  "http://localhost:3000";

const trustedOrigins = [
  appUrl,
  ...(process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean),
  "powerchain://",
];

async function sendAuthEmail(
  data: AuthEmailData,
) {
  await sendRenderedMail({
    to: [data.email],
    email: renderAuthEmail(data),
  });
}

export const betterAuthEnabled =
  process.env.BETTER_AUTH_ENABLED !== "false" &&
  Boolean(databaseUrl) &&
  Boolean(configuredSecret);

export const auth = betterAuth({
  appName: "PowerChain Launchpad",
  baseURL: appUrl,
  basePath: "/api/auth",
  secret: effectiveSecret,
  database: authPool,
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        kind: "password-reset",
        email: user.email,
        displayName: user.name,
        actionUrl: url,
      });
    },
    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        kind: "confirm-email",
        email: user.email,
        displayName: user.name,
        actionUrl: url,
      });
    },
  },

  socialProviders: {
    ...(google ? { google } : {}),
    ...(github ? { github } : {}),
    ...(discord ? { discord } : {}),
    ...(apple ? { apple } : {}),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: "database",
    accountLinking: {
      enabled: true,
      disableImplicitLinking: true,
      trustedProviders: [
        "google",
        "github",
        "email-password",
      ],
      allowDifferentEmails: false,
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});

export function configuredSocialProviders() {
  return [
    google ? "google" : null,
    github ? "github" : null,
    discord ? "discord" : null,
    apple ? "apple" : null,
  ].filter(
    (value): value is "google" | "github" | "discord" | "apple" =>
      Boolean(value),
  );
}
