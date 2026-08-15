import {
  errorFromUnknown,
  json,
  requestId,
} from "../../../../lib/http";
import {
  requireAccountSession,
} from "../../../../lib/account-session";
import {
  walletsForUser,
} from "../../../../lib/wallet-accounts";

export async function GET(
  request: Request,
) {
  const id = requestId(request);

  try {
    const session =
      await requireAccountSession(request);

    return json(
      {
        ok: true,
        account: {
          kind: session.kind,
          userId: session.userId,
          email: session.email,
          wallet: session.wallet,
          linkedWallets:
            session.kind === "account"
              ? await walletsForUser(
                  session.userId,
                )
              : [],
        },
      },
      {},
      id,
    );
  } catch (error) {
    return errorFromUnknown(error, id);
  }
}
