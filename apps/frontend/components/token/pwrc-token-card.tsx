import { PWRC_TOKEN, POWERCHAIN_FEE_POLICY } from "../../lib/token-data";

export function PwrcTokenCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6" aria-labelledby="pwrc-token-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">PowerChain token</p>
          <h2 id="pwrc-token-title" className="mt-1 text-2xl font-semibold text-neutral-950">
            {PWRC_TOKEN.name} ({PWRC_TOKEN.symbol})
          </h2>
        </div>
        <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-white">
          Token-2022
        </span>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Fixed supply</dt>
          <dd className="mt-1 font-medium text-neutral-950">18,446,000,000 PWRC</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Decimals</dt>
          <dd className="mt-1 font-medium text-neutral-950">{PWRC_TOKEN.decimals}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Purchase fee</dt>
          <dd className="mt-1 font-medium text-neutral-950">{POWERCHAIN_FEE_POLICY.purchaseServiceFeePercent}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Deployment</dt>
          <dd className="mt-1 font-medium text-neutral-950">
            {PWRC_TOKEN.deploymentStatus === "verified" ? "Verified" : "Configuration ready"}
          </dd>
        </div>
      </dl>

      {!PWRC_TOKEN.mintAddress ? (
        <p className="mt-5 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">
          Verified mainnet mint address will appear only after deployment verification.
        </p>
      ) : null}
    </section>
  );
}
