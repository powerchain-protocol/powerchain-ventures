import {
  AppShell,
} from "../../../components/app-shell";
import {
  NetworkStatus,
} from "../../../components/launchpad/network-status";
import {
  SaleOverview,
} from "../../../components/launchpad/sale-overview";

export default async function SalePage({
  params,
}: {
  params: Promise<{
    saleId: string;
  }>;
}) {
  const { saleId } =
    await params;

  return (
    <AppShell>
      <main className="page">
        <div className="sale-page-top">
          <a
            className="text-button"
            href="/sales"
          >
            ← All sales
          </a>
          <NetworkStatus
            compact
          />
        </div>

        <SaleOverview
          saleId={saleId}
        />
      </main>
    </AppShell>
  );
}
