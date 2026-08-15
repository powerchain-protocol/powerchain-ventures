import type {
  Metadata,
} from "next";
import {
  CheckoutShell,
} from "../../../components/checkout-shell";
import {
  PurchaseFlow,
} from "../../../components/purchase-flow";

export const metadata:
  Metadata = {
  title: "Purchase",
};

export default async function PurchasePage({
  params,
}: {
  params: Promise<{
    saleId: string;
  }>;
}) {
  const { saleId } =
    await params;

  return (
    <CheckoutShell>
      <main className="checkout-page">
        <PurchaseFlow
          saleId={saleId}
        />
      </main>
    </CheckoutShell>
  );
}
