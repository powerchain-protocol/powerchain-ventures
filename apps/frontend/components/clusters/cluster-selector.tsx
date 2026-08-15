"use client";

import type {
  NetworkDefinition,
  NetworkId,
} from "../../data/networks";
import {
  Select,
} from "../ui/select";

export function ClusterSelector({
  value,
  networks,
  onChange,
  label = "Network",
}: {
  value: NetworkId;
  networks:
    readonly NetworkDefinition[];
  onChange: (
    value: NetworkId,
  ) => void;
  label?: string;
}) {
  return (
    <Select
      label={label}
      value={value}
      onValueChange={onChange}
      options={networks.map(
        network => ({
          value: network.id,
          label: network.name,
          disabled:
            !network.enabled,
        }),
      )}
    />
  );
}
