import {
  auth,
  betterAuthEnabled,
} from "./better-auth";
import {
  readWalletSession,
} from "./wallet-auth";
import {
  PowerChainError,
} from "@powerchain/utils/utils/errors";

export type ResolvedAccountSession =
  | {
      authenticated: true;
      kind: "account";
      userId: string;
      email: string | null;
      wallet: null;
    }
  | {
      authenticated: true;
      kind: "wallet";
      userId: null;
      email: null;
      wallet: string;
    }
  | {
      authenticated: false;
      kind: null;
      userId: null;
      email: null;
      wallet: null;
    };

export async function resolveAccountSession(
  request: Request,
): Promise<ResolvedAccountSession> {
  if (betterAuthEnabled) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (session?.user) {
        return {
          authenticated: true,
          kind: "account",
          userId: session.user.id,
          email: session.user.email ?? null,
          wallet: null,
        };
      }
    } catch {
      // Continue to wallet-auth fallback.
    }
  }

  const walletSession = readWalletSession(request);

  if (walletSession) {
    return {
      authenticated: true,
      kind: "wallet",
      userId: null,
      email: null,
      wallet: walletSession.wallet,
    };
  }

  return {
    authenticated: false,
    kind: null,
    userId: null,
    email: null,
    wallet: null,
  };
}

export async function requireAccountSession(
  request: Request,
) {
  const session = await resolveAccountSession(request);

  if (!session.authenticated) {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "Authentication is required",
    );
  }

  return session;
}

export async function requireBetterAuthAccount(
  request: Request,
) {
  const session = await resolveAccountSession(request);

  if (!session.authenticated || session.kind !== "account") {
    throw new PowerChainError(
      "UNAUTHORIZED",
      "A PowerChain account session is required",
    );
  }

  return session;
}
