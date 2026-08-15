import {
  PublicDataCircuitBreaker,
  PublicDataError,
  assertPowerChainPublicRegistryEnvelope,
  retryDelayMs,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "@powerchain/token-data";
import { publicDataSnapshot } from "./public-data-client";

const circuit = new PublicDataCircuitBreaker(3, 30_000);

async function sleep(ms: number, signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

export async function fetchPublicDataResilient(
  apiBase = "",
  options: { signal?: AbortSignal; attempts?: number } = {},
): Promise<{
  data: PublicDataEnvelope<PowerChainPublicRegistry>;
  source: "network" | "snapshot";
  stale: boolean;
  errorCode: string | null;
}> {
  if (!circuit.canRequest()) {
    const fallback = publicDataSnapshot(new Error("Circuit open"));
    return { ...fallback, errorCode: "PUBLIC_DATA_UNAVAILABLE" };
  }

  const attempts = Math.max(1, Math.min(options.attempts ?? 2, 3));
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${apiBase}/api/v1/public-data`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: options.signal,
      });
      if (!response.ok) {
        throw new PublicDataError(
          "PUBLIC_DATA_NETWORK",
          `Public data request failed (${response.status})`,
          response.status >= 500,
        );
      }
      const payload = await response.json();
      assertPowerChainPublicRegistryEnvelope(payload);
      circuit.success();
      return { data: payload, source: "network", stale: false, errorCode: null };
    } catch (error) {
      lastError = error;
      circuit.failure();
      if (attempt + 1 < attempts) {
        await sleep(retryDelayMs(attempt), options.signal);
      }
    }
  }

  const fallback = publicDataSnapshot(lastError);
  return {
    ...fallback,
    errorCode: lastError instanceof PublicDataError ? lastError.code : "PUBLIC_DATA_UNAVAILABLE",
  };
}

export function publicDataCircuitSnapshot() {
  return circuit.snapshot();
}
