import {
  json,
  readJson,
  requestId,
  errorFromUnknown,
} from "../../../../../../lib/http";
import {
  enforceRateLimit,
} from "../../../../../../lib/rate-limit-response";
import {
  requireSolanaAddress,
  requireString,
} from "../../../../../../lib/validate";
import {
  clearWalletAuthCookies,
  verifyWalletChallenge,
  walletSessionCookie,
} from "../../../../../../lib/wallet-auth";
import {
  recordWalletIdentity,
} from "../../../../../../lib/wallet-accounts";
import {
  auth,
  betterAuthEnabled,
} from "../../../../../../lib/better-auth";

export async function POST(
  request: Request,
) {
  const id = requestId(request);

  try {
    const limited =
      await enforceRateLimit(
        request,
        "auth.wallet.verify",
        20,
      );
    if (limited) return limited;

    const body =
      await readJson<{
        address?: string;
        message?: string;
        signatureBase64?: string;
      }>(request);

    const address =
      requireSolanaAddress(
        body.address,
        "address",
      );

    const session =
      verifyWalletChallenge({
        request,
        address,
        message: requireString(
          body.message,
          "message",
          2_000,
        ),
        signatureBase64:
          requireString(
            body.signatureBase64,
            "signatureBase64",
            256,
          ),
      });

    let authUserId: string | null = null;

    if (betterAuthEnabled) {
      try {
        const better =
          await auth.api.getSession({
            headers: request.headers,
          });
        authUserId =
          better?.user?.id ?? null;
      } catch {
        authUserId = null;
      }
    }

    await recordWalletIdentity({
      wallet: session.wallet,
      authUserId,
    });

    const headers =
      clearWalletAuthCookies();
    headers.append(
      "set-cookie",
      walletSessionCookie(session),
    );

    return json(
      {
        ok: true,
        authenticated: true,
        authType:
          authUserId
            ? "linked-wallet"
            : "wallet",
        wallet: session.wallet,
        user: authUserId
          ? { id: authUserId }
          : {
              id: `wallet:${session.wallet}`,
              email: null,
              displayName: null,
            },
      },
      { headers },
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}
