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
} from "../../../../../../lib/validate";
import {
  createWalletChallenge,
} from "../../../../../../lib/wallet-auth";

export async function POST(
  request: Request,
) {
  const id = requestId(request);

  try {
    const limited =
      await enforceRateLimit(
        request,
        "auth.wallet.challenge",
        20,
      );
    if (limited) return limited;

    const body =
      await readJson<{
        address?: string;
      }>(request);

    const address =
      requireSolanaAddress(
        body.address,
        "address",
      );

    const result =
      createWalletChallenge({
        address,
        requestId: id,
      });

    const headers = new Headers();
    headers.append(
      "set-cookie",
      result.cookie,
    );

    return json(
      {
        ok: true,
        address,
        message:
          result.challenge.message,
        expiresAt:
          result.challenge.expiresAt,
      },
      { headers },
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}
