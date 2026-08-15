import {
  auth,
  betterAuthEnabled,
} from "../../../../../lib/better-auth";
import {
  readWalletSession,
} from "../../../../../lib/wallet-auth";
import {
  walletsForUser,
} from "../../../../../lib/wallet-accounts";
import {
  resolveSession as resolveLegacySession,
  authEnabled as legacyAuthEnabled,
} from "../../../../../lib/auth";
import {
  errorFromUnknown,
  json,
  requestId,
} from "../../../../../lib/http";

export async function GET(
  request: Request,
) {
  const id = requestId(request);

  try {
    if (betterAuthEnabled) {
      const session =
        await auth.api.getSession({
          headers: request.headers,
        });

      if (session?.user) {
        return json(
          {
            ok: true,
            configured: true,
            engine: "better-auth",
            authenticated: true,
            authType: "account",
            user: {
              id: session.user.id,
              email:
                session.user.email ?? null,
              displayName:
                session.user.name ?? null,
              image:
                session.user.image ?? null,
              emailVerified:
                session.user.emailVerified,
              createdAt:
                session.user.createdAt instanceof Date
                  ? session.user.createdAt.toISOString()
                  : String(session.user.createdAt ?? ""),
            },
            wallets:
              await walletsForUser(
                session.user.id,
              ),
          },
          {},
          id,
        );
      }
    }

    const wallet =
      readWalletSession(request);

    if (wallet) {
      return json(
        {
          ok: true,
          configured: true,
          engine: "wallet-signature",
          authenticated: true,
          authType: "wallet",
          user: {
            id: `wallet:${wallet.wallet}`,
            email: null,
            displayName: null,
            image: null,
            emailVerified: false,
            createdAt:
              wallet.issuedAt,
          },
          wallets: [
            {
              address: wallet.wallet,
              chain: wallet.chain,
              provider:
                "wallet-signature",
              lastAuthenticatedAt:
                wallet.issuedAt,
            },
          ],
        },
        {},
        id,
      );
    }

    if (legacyAuthEnabled()) {
      const legacy =
        await resolveLegacySession(
          request,
        );

      if (legacy.authenticated) {
        return json(
          {
            ok: true,
            configured: true,
            engine: "supabase-legacy",
            authenticated: true,
            authType: "legacy",
            user: legacy.user,
            wallets: [],
          },
          {
            headers:
              legacy.headers,
          },
          id,
        );
      }
    }

    return json(
      {
        ok: true,
        configured:
          betterAuthEnabled ||
          legacyAuthEnabled(),
        engine:
          betterAuthEnabled
            ? "better-auth"
            : legacyAuthEnabled()
              ? "supabase-legacy"
              : "wallet-signature",
        authenticated: false,
        authType: null,
        user: null,
        wallets: [],
      },
      {},
      id,
    );
  } catch (error) {
    return errorFromUnknown(
      error,
      id,
    );
  }
}
