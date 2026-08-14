export * from "@powerchain/utils/utils/errors";

import { PowerChainError, normalizeError, type PowerChainErrorCode } from "@powerchain/utils/utils/errors";

const MESSAGE_CODE_MAP: Array<[RegExp, PowerChainErrorCode]> = [
  [/unauthor|secret|creator_mismatch/i, "UNAUTHORIZED"],
  [/not[_ -]?eligible/i, "NOT_ELIGIBLE"],
  [/sale.*(closed|ended|inactive)|sale_closed/i, "SALE_CLOSED"],
  [/quote.*expired|quote_expired/i, "QUOTE_EXPIRED"],
  [/rate[_ -]?limit/i, "RATE_LIMITED"],
  [/not[_ -]?found/i, "NOT_FOUND"],
  [/conflict|already_|duplicate/i, "CONFLICT"],
  [/rpc_|solana.*unavailable/i, "RPC_UNAVAILABLE"],
  [/transaction.*(reject|mismatch)/i, "TRANSACTION_REJECTED"],
  [/transaction.*fail/i, "TRANSACTION_FAILED"],
  [/config|not_configured|missing.*env/i, "CONFIGURATION_ERROR"]
];

export function classifyError(value: unknown): PowerChainError {
  if (value instanceof PowerChainError) return value;
  const normalized = normalizeError(value);
  const matched = MESSAGE_CODE_MAP.find(([pattern]) => pattern.test(normalized.message));
  if (!matched) return normalized;
  return new PowerChainError(matched[1], normalized.message, { cause: value });
}
