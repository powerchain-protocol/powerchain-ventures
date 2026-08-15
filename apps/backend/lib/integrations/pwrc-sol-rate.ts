import {
  getUsdPrice,
} from "./prices";

export type PwrcSolRate = {
  available: boolean;
  pwrcMint: string;
  solMint: string;
  pwrcUsd: number | null;
  solUsd: number | null;
  pwrcPerSol: number | null;
  solPerPwrc: number | null;
  observedAt: string;
  provider: string;
};

export async function getPwrcSolRate(
  pwrcMint: string,
): Promise<PwrcSolRate> {
  const [pwrc, sol] =
    await Promise.all([
      getUsdPrice("PWRC"),
      getUsdPrice("SOL"),
    ]);

  const pwrcUsd =
    pwrc.available
      ? pwrc.priceUsd
      : null;
  const solUsd =
    sol.available
      ? sol.priceUsd
      : null;

  return {
    available:
      Boolean(
        pwrcUsd &&
        solUsd,
      ),
    pwrcMint,
    solMint:
      "So11111111111111111111111111111111111111112",
    pwrcUsd,
    solUsd,
    pwrcPerSol:
      pwrcUsd &&
      solUsd
        ? solUsd /
          pwrcUsd
        : null,
    solPerPwrc:
      pwrcUsd &&
      solUsd
        ? pwrcUsd /
          solUsd
        : null,
    observedAt:
      new Date().toISOString(),
    provider: [
      ...new Set([
        ...pwrc.sources.map(
          source =>
            source.provider,
        ),
        ...sol.sources.map(
          source =>
            source.provider,
        ),
      ]),
    ].join("+") ||
      "unavailable",
  };
}

export function presaleSolEstimate(
  usdMicros: string,
  solUsd: number | null,
) {
  if (
    !solUsd ||
    solUsd <= 0
  ) {
    return null;
  }

  const micros =
    BigInt(usdMicros);
  const solUsdMicros =
    BigInt(
      Math.round(
        solUsd *
          1_000_000,
      ),
    );

  if (
    solUsdMicros <= 0n
  ) {
    return null;
  }

  const lamports =
    (
      micros *
        1_000_000_000n +
      solUsdMicros -
      1n
    ) /
    solUsdMicros;

  return {
    solUsd,
    solUsdMicros:
      solUsdMicros.toString(),
    estimatedLamports:
      lamports.toString(),
    estimatedSol:
      Number(lamports) /
      1_000_000_000,
  };
}
