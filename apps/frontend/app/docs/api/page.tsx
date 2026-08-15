import Link from "next/link";

const endpoints = [
  ["OpenAPI", "/api/v1/openapi", "Canonical OpenAPI 3.1 YAML"],
  ["Version", "/api/v1/version", "Release and API metadata"],
  ["Health", "/api/v1/health", "Backend liveness"],
  ["Ready", "/api/v1/ready", "Production readiness"],
  ["Capabilities", "/api/v1/capabilities", "Runtime capabilities"],
  ["Public data", "/api/v1/public-data", "Canonical public Launchpad data"],
] as const;

export default function ApiDocumentationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium text-blue-600">Developers</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          PowerChain Launchpad API
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          API v1 is owned by the backend application. The canonical OpenAPI
          document is stored with the backend and served through the versioned API.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {endpoints.map(([name, route, description]) => (
          <article key={route} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold text-slate-950">{name}</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                GET
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            <code className="mt-4 block overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-white">
              {route}
            </code>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-950">Contract ownership</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Source of truth: <code>apps/backend/api/openapi/openapi.yaml</code>.
          Do not create root-level Swagger/OpenAPI copies. Run{" "}
          <code>pnpm openapi:check</code> after API changes.
        </p>
      </section>

      <div className="mt-8">
        <Link href="/docs" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to documentation
        </Link>
      </div>
    </main>
  );
}
