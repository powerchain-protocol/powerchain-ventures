import {
  PublicDataCircuitBreaker,
  PublicDataError,
  assertPowerChainPublicRegistryEnvelope,
  retryDelayMs,
  type PowerChainPublicRegistry,
  type PublicDataEnvelope,
} from "@powerchain/token-data";
import { publicDataFallback } from "./public-data";

const circuit = new PublicDataCircuitBreaker(3, 30_000);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPublicDataResilient(
  apiBaseUrl: string,
  attempts = 2,
): Promise<{
  data: PublicDataEnvelope<PowerChainPublicRegistry>;
  source: "network" | "snapshot";
  stale: boolean;
  errorCode: string | null;
}> {
  if (!circuit.canRequest()) {
    return {
      data: publicDataFallback(),
      source: "snapshot",
      stale: true,
      errorCode: "PUBLIC_DATA_UNAVAILABLE",
    };
  }

  const base = apiBaseUrl.replace(/\/$/, "");
  let lastError: unknown;

  for (let attempt = 0; attempt < Math.max(1, Math.min(attempts, 3)); attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(`${base}/api/v1/public-data`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new PublicDataError(
          "PUBLIC_DATA_NETWORK",
          `Public data request failed (${response.status})`,
          response.status >= 500,
        );
      }
      const data = await response.json();
      assertPowerChainPublicRegistryEnvelope(data);
      circuit.success();
      return { data, source: "network", stale: false, errorCode: null };
    } catch (error) {
      lastError = error;
      circuit.failure();
      if (attempt + 1 < attempts) await sleep(retryDelayMs(attempt));
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    data: publicDataFallback(),
    source: "snapshot",
    stale: true,
    errorCode: lastError instanceof PublicDataError ? lastError.code : "PUBLIC_DATA_UNAVAILABLE",
  };
}
