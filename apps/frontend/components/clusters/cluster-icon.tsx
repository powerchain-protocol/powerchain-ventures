import {
  AssetIcon,
} from "../web3/asset-icon";
import type {
  NetworkFamily,
} from "../../data/networks";

export function ClusterIcon({
  family,
  size = 28,
}: {
  family: NetworkFamily;
  size?: number;
}) {
  return (
    <AssetIcon
      kind="network"
      id={family}
      size={size}
    />
  );
}
