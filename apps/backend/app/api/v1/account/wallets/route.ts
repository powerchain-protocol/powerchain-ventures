import {
  errorFromUnknown,
  json,
  readJson,
  requestId,
} from "../../../../../lib/http";
import {
  requireBetterAuthAccount,
} from "../../../../../lib/account-session";
import {
  walletsForUser,
  unlinkWallet,
} from "../../../../../lib/wallet-accounts";
import {
  requireSolanaAddress,
  requireSuiAddress,
  requireString,
} from "../../../../../lib/validate";

export async function GET(
  request: Request,
) {
  const id = requestId(request);

  try {
    const session =
      await requireBetterAuthAccount(request);

    return json(
      {
        ok: true,
        wallets:
          await walletsForUser(
            session.userId,
          ),
      },
      {},
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}

export async function DELETE(
  request: Request,
) {
  const id = requestId(request);

  try {
    const session =
      await requireBetterAuthAccount(request);

    const body =
      await readJson<{
        chain?: string;
        address?: string;
      }>(request);

    const chain =
      requireString(
        body.chain,
        "chain",
        16,
      );

    if (
      chain !== "solana" &&
      chain !== "sui"
    ) {
      throw new Error(
        "chain must be solana or sui",
      );
    }

    const address =
      chain === "solana"
        ? requireSolanaAddress(
            body.address,
            "address",
          )
        : requireSuiAddress(
            body.address,
            "address",
          );

    const removed =
      await unlinkWallet({
        authUserId:
          session.userId,
        chain,
        wallet: address,
      });

    return json(
      {
        ok: true,
        removed,
      },
      {},
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}
