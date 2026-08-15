import {
  json,
} from "../../../../../../lib/http";
import {
  clearWalletAuthCookies,
} from "../../../../../../lib/wallet-auth";

export async function POST() {
  return json(
    { ok: true },
    {
      headers:
        clearWalletAuthCookies(),
    },
  );
}
