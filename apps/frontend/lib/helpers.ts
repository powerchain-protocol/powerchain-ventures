import {
  fetchJsonWithPolicy,
  type FetchJsonOptions,
} from "@powerchain/utils/http";

export * from "@powerchain/utils/helpers";
export * from "@powerchain/utils/http";

export function shortAddress(value: string, head = 4, tail = 4): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function fetchJson<T>(
  input: RequestInfo | URL,
  options: FetchJsonOptions = {},
  fallback = "Request failed",
): Promise<T> {
  return fetchJsonWithPolicy<T>(input, {
    ...options,
    fallbackMessage: options.fallbackMessage ?? fallback,
  });
}
