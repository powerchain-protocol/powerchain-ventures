import type {
  NetworkDefinition,
} from "../../data/networks";
import {
  Badge,
} from "../ui/badge";
import {
  Card,
} from "../ui/card";
import {
  ClusterIcon,
} from "./cluster-icon";

export function ClusterCard({
  network,
}: {
  network: NetworkDefinition;
}) {
  return (
    <Card className="cluster-card">
      <div className="cluster-card-head">
        <ClusterIcon
          family={network.family}
          size={34}
        />
        <div>
          <h3>{network.name}</h3>
          <span>
            Native asset:{" "}
            {network.nativeAsset}
          </span>
        </div>
      </div>

      <div className="cluster-card-badges">
        <Badge
          tone={
            network.enabled
              ? "success"
              : "neutral"
          }
        >
          {network.enabled
            ? "Available"
            : "Disabled"}
        </Badge>

        <Badge
          tone={
            network.settlementEnabled
              ? "info"
              : "warning"
          }
        >
          {network.settlementEnabled
            ? "Settlement enabled"
            : "Settlement adapter required"}
        </Badge>
      </div>
    </Card>
  );
}
