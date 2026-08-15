export type PublicDataErrorCode =
  | "PUBLIC_DATA_NETWORK"
  | "PUBLIC_DATA_TIMEOUT"
  | "PUBLIC_DATA_SCHEMA"
  | "PUBLIC_DATA_RELEASE"
  | "PUBLIC_DATA_INTEGRITY"
  | "PUBLIC_DATA_UNAVAILABLE";

export class PublicDataError extends Error {
  readonly code: PublicDataErrorCode;
  readonly retryable: boolean;

  constructor(code: PublicDataErrorCode, message: string, retryable = false) {
    super(message);
    this.name = "PublicDataError";
    this.code = code;
    this.retryable = retryable;
  }
}

export function publicDataErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Public data unavailable";
}
