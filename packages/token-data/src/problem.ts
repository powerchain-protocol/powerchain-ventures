export type PowerChainProblemCode =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PUBLIC_DATA_UNAVAILABLE"
  | "PUBLIC_DATA_INCOMPATIBLE"
  | "INTERNAL_ERROR";

export interface PowerChainProblem {
  readonly type: "about:blank";
  readonly title: string;
  readonly status: number;
  readonly code: PowerChainProblemCode;
  readonly detail: string;
  readonly requestId: string;
  readonly release: "1.0.0";
}

export function createPowerChainProblem(
  code: PowerChainProblemCode,
  status: number,
  title: string,
  detail: string,
  requestId: string,
): PowerChainProblem {
  return {
    type: "about:blank",
    title,
    status,
    code,
    detail,
    requestId,
    release: "1.0.0",
  };
}
