import type {
  NetworkDefinition,
} from "../../data/networks";
import {
  Badge,
} from "../ui/badge";
import {
  ClusterIcon,
} from "./cluster-icon";

export function ClusterBadge({
  network,
  showEnvironment = true,
}: {
  network: NetworkDefinition;
  showEnvironment?: boolean;
}) {
  return (
    <span className="cluster-badge">
      <ClusterIcon
        family={network.family}
        size={18}
      />
      <span>
        {network.shortName}
      </span>
      {showEnvironment ? (
        <Badge
          tone={
            network.environment ===
            "mainnet"
              ? "success"
              : "neutral"
          }
        >
          {network.environment}
        </Badge>
      ) : null}
    </span>
  );
}
