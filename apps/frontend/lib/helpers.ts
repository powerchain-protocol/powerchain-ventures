export * from "@powerchain/utils/helpers";
export * from "@powerchain/utils/http";

import { fetchJsonWithPolicy, type FetchJsonOptions } from "@powerchain/utils/http";

export function fetchJson<T>(input: RequestInfo | URL, options: FetchJsonOptions = {}, fallback = "Request failed"): Promise<T> {
  return fetchJsonWithPolicy<T>(input, { ...options, fallbackMessage: options.fallbackMessage ?? fallback });
}
