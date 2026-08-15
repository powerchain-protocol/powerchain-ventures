import { PwrcTokenCard } from "../../components/token/pwrc-token-card";

export default function TokenPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold text-emerald-900">PWRC</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">PowerChain token</h1>
        <p className="mt-3 text-neutral-600">
          Canonical public token information used across PowerChain Launchpad.
        </p>
      </header>
      <PwrcTokenCard />
    </main>
  );
}
