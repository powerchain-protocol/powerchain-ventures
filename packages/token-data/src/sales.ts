export type SaleLifecycleStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type DeliveryMode = "immediate" | "claim" | "vesting";

export interface PublicSaleData {
  readonly id: string;
  readonly slug: string;
  readonly tokenSymbol: string;
  readonly status: SaleLifecycleStatus;
  readonly startsAt: string | null;
  readonly endsAt: string | null;
  readonly deliveryMode: DeliveryMode;
  readonly allocationBaseUnits: string | null;
  readonly soldBaseUnits: string;
  readonly participantCount: number;
}

export function isSaleActive(
  sale: Pick<PublicSaleData, "status" | "startsAt" | "endsAt">,
  now = Date.now(),
): boolean {
  if (sale.status !== "active" || !sale.startsAt || !sale.endsAt) return false;
  const startsAt = Date.parse(sale.startsAt);
  const endsAt = Date.parse(sale.endsAt);
  return Number.isFinite(startsAt) && Number.isFinite(endsAt) && now >= startsAt && now < endsAt;
}

export function saleRemainingBaseUnits(
  sale: Pick<PublicSaleData, "allocationBaseUnits" | "soldBaseUnits">,
): bigint | null {
  if (sale.allocationBaseUnits === null) return null;
  const allocation = BigInt(sale.allocationBaseUnits);
  const sold = BigInt(sale.soldBaseUnits);
  return allocation > sold ? allocation - sold : 0n;
}
