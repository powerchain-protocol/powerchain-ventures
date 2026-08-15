export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitSnapshot {
  readonly state: CircuitState;
  readonly failures: number;
  readonly openedAt: number | null;
}

export class PublicDataCircuitBreaker {
  #state: CircuitState = "closed";
  #failures = 0;
  #openedAt: number | null = null;

  constructor(
    private readonly threshold = 3,
    private readonly resetAfterMs = 30_000,
  ) {}

  canRequest(now = Date.now()): boolean {
    if (this.#state !== "open") return true;
    if (this.#openedAt !== null && now - this.#openedAt >= this.resetAfterMs) {
      this.#state = "half-open";
      return true;
    }
    return false;
  }

  success(): void {
    this.#state = "closed";
    this.#failures = 0;
    this.#openedAt = null;
  }

  failure(now = Date.now()): void {
    this.#failures += 1;
    if (this.#failures >= this.threshold) {
      this.#state = "open";
      this.#openedAt = now;
    }
  }

  snapshot(): CircuitSnapshot {
    return {
      state: this.#state,
      failures: this.#failures,
      openedAt: this.#openedAt,
    };
  }
}

export function retryDelayMs(attempt: number, baseMs = 250, maxMs = 2_000): number {
  const boundedAttempt = Math.max(0, Math.min(attempt, 6));
  return Math.min(maxMs, baseMs * 2 ** boundedAttempt);
}

export function retryDelayWithJitterMs(
  attempt: number,
  random = Math.random,
  baseMs = 250,
  maxMs = 2_000,
): number {
  const delay = retryDelayMs(attempt, baseMs, maxMs);
  const jitter = Math.max(0, Math.min(1, random()));
  return Math.min(maxMs, Math.round(delay * (0.75 + jitter * 0.5)));
}
