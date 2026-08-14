export type UiTone = "neutral" | "info" | "success" | "warning" | "danger";

export type NetworkReadinessStatus = "checking" | "ready" | "degraded" | "incomplete" | "offline";
export type WalletConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
export type EligibilityStatus = "unknown" | "checking" | "eligible" | "ineligible";
export type SaleStatus = "draft" | "scheduled" | "private" | "public" | "ended" | "claimable" | "completed" | "cancelled";
export type SettlementStatus = "prepared" | "submitted" | "chain-confirmed" | "payment-verified" | "delivery-verified" | "settled" | "failed" | "expired";

export type StatusDescriptor = {
  label: string;
  tone: UiTone;
  detail?: string;
};

export const SETTLEMENT_STATUS_ORDER: readonly SettlementStatus[] = [
  "prepared",
  "submitted",
  "chain-confirmed",
  "payment-verified",
  "delivery-verified",
  "settled",
  "failed",
  "expired",
] as const;

export function describeWalletStatus(status: WalletConnectionStatus): StatusDescriptor {
  switch (status) {
    case "connected": return { label: "Connected", tone: "success" };
    case "connecting": return { label: "Connecting", tone: "info" };
    case "error": return { label: "Connection issue", tone: "danger" };
    default: return { label: "Not connected", tone: "neutral" };
  }
}

export function describeNetworkStatus(status: NetworkReadinessStatus): StatusDescriptor {
  switch (status) {
    case "ready": return { label: "Mainnet ready", tone: "success" };
    case "degraded": return { label: "Mainnet degraded", tone: "warning" };
    case "incomplete": return { label: "Configuration incomplete", tone: "danger" };
    case "offline": return { label: "Network unavailable", tone: "danger" };
    default: return { label: "Checking mainnet", tone: "info" };
  }
}

export function describeSaleStatus(status: SaleStatus): StatusDescriptor {
  switch (status) {
    case "public": return { label: "Public sale", tone: "success" };
    case "private": return { label: "Private sale", tone: "info" };
    case "scheduled": return { label: "Upcoming", tone: "info" };
    case "claimable": return { label: "Claimable", tone: "success" };
    case "completed": return { label: "Completed", tone: "neutral" };
    case "cancelled": return { label: "Cancelled", tone: "danger" };
    case "ended": return { label: "Sale ended", tone: "warning" };
    default: return { label: "Draft", tone: "neutral" };
  }
}

export function describeSettlementStatus(status: SettlementStatus): StatusDescriptor {
  switch (status) {
    case "settled": return { label: "Settled", tone: "success" };
    case "delivery-verified": return { label: "Delivery verified", tone: "success" };
    case "payment-verified": return { label: "Payment verified", tone: "info" };
    case "chain-confirmed": return { label: "Chain confirmed", tone: "info" };
    case "submitted": return { label: "Submitted", tone: "info" };
    case "failed": return { label: "Failed", tone: "danger" };
    case "expired": return { label: "Expired", tone: "warning" };
    default: return { label: "Prepared", tone: "neutral" };
  }
}
