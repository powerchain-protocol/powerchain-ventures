import type {
  NetworkFamily,
} from "../../data/networks";
import {
  networkCapability,
  type NetworkCapability,
} from "../../data/network-capabilities";
import {
  Badge,
} from "../ui/badge";

const LABELS:
  Record<
    NetworkCapability,
    string
  > = {
    "wallet-connect": "Wallet",
    "balance-read": "Balances",
    "asset-transfer": "Transfers",
    "sale-purchase": "Purchases",
    claim: "Claims",
    "creator-operations":
      "Creator",
  };

export function NetworkCapabilities({
  family,
}: {
  family: NetworkFamily;
}) {
  return (
    <div className="network-capability-grid">
      {(
        Object.keys(
          LABELS,
        ) as NetworkCapability[]
      ).map(capability => {
        const state =
          networkCapability(
            family,
            capability,
          );

        return (
          <div
            key={capability}
            className="network-capability-row"
          >
            <span>
              {LABELS[capability]}
            </span>
            <Badge
              tone={
                state === "ready"
                  ? "success"
                  : state ===
                      "adapter-required"
                    ? "warning"
                    : "neutral"
              }
            >
              {state === "ready"
                ? "Ready"
                : state ===
                    "adapter-required"
                  ? "Adapter required"
                  : "Unsupported"}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
