import {
  betterAuthClient,
} from "../lib/auth-client";
import type {
  AuthUser,
} from "../types/auth";
import type {
  AuthProviderConfig,
  SocialAuthProvider,
} from "../types/accounts";
import {
  apiClient,
} from "./api-client";
import {
  API_ENDPOINTS,
} from "./endpoints";

export const authService = {
  session() {
    return apiClient.get<{
      configured: boolean;
      authenticated: boolean;
      engine?: string;
      authType?: string | null;
      user: AuthUser | null;
      wallets?: Array<{
        address: string;
        chain: "solana" | "sui";
        provider: string;
        lastAuthenticatedAt: string | null;
      }>;
    }>(
      API_ENDPOINTS.auth.session,
      {
        timeoutMs: 8_000,
        retries: 0,
      },
    );
  },

  providers() {
    return apiClient.get<{
      auth: AuthProviderConfig;
    }>(
      "/api/v1/auth/providers",
      {
        timeoutMs: 8_000,
        retries: 0,
      },
    );
  },

  async signIn(
    email: string,
    password: string,
  ) {
    const providerConfig =
      await this.providers();

    if (
      providerConfig.auth.engine ===
      "legacy"
    ) {
      return apiClient.post<
        { user: AuthUser },
        {
          email: string;
          password: string;
        }
      >(
        API_ENDPOINTS.auth.signIn,
        { email, password },
        { timeoutMs: 10_000 },
      );
    }

    const result =
      await betterAuthClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: "/dashboard",
      });

    if (result.error) {
      throw new Error(
        result.error.message ??
          "Unable to sign in",
      );
    }

    const session =
      await this.session();

    return {
      user: session.user!,
    };
  },

  async signUp(input: {
    email: string;
    password: string;
    displayName: string;
  }) {
    const providerConfig =
      await this.providers();

    if (
      providerConfig.auth.engine ===
      "legacy"
    ) {
      return apiClient.post<
        {
          user: AuthUser | null;
          emailConfirmationRequired: boolean;
        },
        typeof input
      >(
        API_ENDPOINTS.auth.signUp,
        input,
        { timeoutMs: 10_000 },
      );
    }

    const result =
      await betterAuthClient.signUp.email({
        email: input.email,
        password: input.password,
        name:
          input.displayName ||
          input.email.split("@")[0]!,
        callbackURL: "/dashboard",
      });

    if (result.error) {
      throw new Error(
        result.error.message ??
          "Unable to create account",
      );
    }

    return {
      user: null,
      emailConfirmationRequired: true,
    };
  },

  async signOut() {
    await Promise.allSettled([
      betterAuthClient.signOut(),
      apiClient.post<
        { ok: boolean },
        Record<string, never>
      >(
        "/api/v1/auth/wallet/sign-out",
        {},
        { timeoutMs: 5_000 },
      ),
    ]);

    return { ok: true };
  },

  async forgotPassword(
    email: string,
  ) {
    const providerConfig =
      await this.providers();

    if (
      providerConfig.auth.engine ===
      "legacy"
    ) {
      return apiClient.post<
        { message: string },
        { email: string }
      >(
        API_ENDPOINTS.auth.forgotPassword,
        { email },
        { timeoutMs: 10_000 },
      );
    }

    const result =
      await betterAuthClient.requestPasswordReset({
        email,
        redirectTo:
          "/auth/update-password",
      });

    if (result.error) {
      throw new Error(
        result.error.message ??
          "Unable to send recovery email",
      );
    }

    return {
      message:
        "If an account exists, a recovery email has been sent.",
    };
  },

  social(
    provider: SocialAuthProvider,
    callbackURL = "/dashboard",
  ) {
    return betterAuthClient.signIn.social({
      provider,
      callbackURL,
      errorCallbackURL:
        "/auth/sign-in?error=social",
      newUserCallbackURL:
        "/dashboard",
    });
  },
};
