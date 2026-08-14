import { PowerChainError } from "@powerchain/utils/utils/errors";
import { requestId } from "./http";
import { requireSolanaAddress } from "./validate";

export type SafeActionContext = {
  requestId: string;
  wallet: string;
  idempotencyKey?: string;
  origin?: string;
};

export function safeActionContext(
  request: Request,
  wallet: unknown,
  opts: { requireIdempotency?: boolean } = {},
): SafeActionContext {
  const normalizedWallet = requireSolanaAddress(wallet);
  const key = request.headers.get("idempotency-key")?.trim() || undefined;
  if (opts.requireIdempotency && !key) {
    throw new PowerChainError("BAD_REQUEST", "idempotency-key header is required");
  }
  if (key && (key.length < 16 || key.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(key))) {
    throw new PowerChainError("BAD_REQUEST", "idempotency-key is invalid");
  }
  const origin = request.headers.get("origin")?.trim() || undefined;
  return {
    requestId: requestId(request),
    wallet: normalizedWallet,
    ...(key ? { idempotencyKey: key } : {}),
    ...(origin ? { origin } : {}),
  };
}

export function assertWalletMatch(expected: string, actual: string) {
  if (expected !== actual) {
    throw new PowerChainError("FORBIDDEN", "Connected wallet does not match the action owner");
  }
}

export async function runSafeAction<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof PowerChainError) throw error;
    throw new PowerChainError("INTERNAL_ERROR", "Safe action failed", { cause: error });
  }
}
