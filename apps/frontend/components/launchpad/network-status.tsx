"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  formatNumber,
} from "@powerchain/utils/formats";
import {
  usePowerChainConfig,
} from "../../context/powerchain-config-context";
import {
  useTransportStatus,
} from "../../hooks/use-transport-status";
import {
  describeNetworkStatus,
  type NetworkReadinessStatus,
} from "../../types/status";
import {
  Badge,
} from "../ui/badge";
import {
  StatusBadge,
} from "../ui/status-badge";

type Status = {
  ok: boolean;
  network?: {
    cluster: string;
    genesisHash: string;
    slot: number;
    blockHeight: number;
    version: string;
    verified: boolean;
  };
  infra?: {
    dedicated: boolean;
    redundant: boolean;
    count: number;
  };
};

export function NetworkStatus({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    config,
    loading: configLoading,
  } = usePowerChainConfig();

  const transport =
    useTransportStatus();

  const [state, setState] =
    useState<Status | null>(null);
  const [error, setError] =
    useState(false);

  useEffect(() => {
    let live = true;

    async function refresh() {
      try {
        const response = await fetch(
          "/api/v1/launchpad/network",
          { cache: "no-store" },
        );
        const data = await response.json();

        if (live) {
          setState(data);
          setError(!response.ok);
        }
      } catch {
        if (live) setError(true);
      }
    }

    void refresh();

    const timer = setInterval(() => {
      if (
        document.visibilityState === "visible"
      ) {
        void refresh();
      }
    }, 30_000);

    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);

  const deploymentReady = Boolean(
    config?.deployment.configured,
  );

  const ok = Boolean(
    state?.ok && deploymentReady,
  );

  const readiness =
    useMemo<NetworkReadinessStatus>(() => {
      if (configLoading && !state) {
        return "checking";
      }
      if (error) return "offline";
      if (config && !deploymentReady) {
        return "incomplete";
      }
      if (
        state?.ok &&
        deploymentReady
      ) {
        return state.infra?.redundant
          ? "ready"
          : "degraded";
      }
      return "checking";
    }, [
      configLoading,
      state,
      error,
      config,
      deploymentReady,
    ]);

  const descriptor =
    describeNetworkStatus(readiness);

  if (compact) {
    return (
      <div className="network-compact-group">
        <StatusBadge
          status={descriptor}
          className="network-compact"
        />
        {transport.websocketConfigured ? (
          <Badge tone="info">WS</Badge>
        ) : null}
      </div>
    );
  }

  return (
    <section
      className={
        `network-banner ${descriptor.tone}`
      }
    >
      <div className="network-summary">
        <StatusBadge status={descriptor} />

        <div>
          <b>
            {ok
              ? "Solana mainnet-beta verified"
              : "PowerChain network readiness"}
          </b>

          <small>
            {state?.network
              ? `Slot ${formatNumber(
                  state.network.slot,
                  0,
                )} • Block ${formatNumber(
                  state.network.blockHeight,
                  0,
                )} • Core ${state.network.version}`
              : "Checking RPC identity, health, deployment addresses and redundancy"}
          </small>

          {config && !deploymentReady ? (
            <small>
              {[
                ...config.deployment.missing,
                ...config.deployment.invalid,
              ]
                .slice(0, 3)
                .join(" • ")}
            </small>
          ) : null}
        </div>
      </div>

      <div className="network-badges">
        <Badge
          tone={
            state?.infra?.dedicated
              ? "success"
              : "neutral"
          }
        >
          {state?.infra?.dedicated
            ? "Dedicated RPC"
            : "RPC check"}
        </Badge>

        <Badge
          tone={
            state?.infra?.redundant
              ? "success"
              : "warning"
          }
        >
          {state?.infra?.redundant
            ? `${state.infra.count} RPC endpoints`
            : "Redundancy check"}
        </Badge>

        <Badge
          tone={
            transport.websocketConfigured
              ? "info"
              : "neutral"
          }
        >
          {transport.websocketConfigured
            ? "WebSocket ready"
            : `${transport.mode} fallback`}
        </Badge>

        <Badge
          tone={
            config?.deployment
              .presaleMintConfigured
              ? "success"
              : "warning"
          }
        >
          {config?.deployment
            .presaleMintConfigured
            ? "PWRC mint configured"
            : "Mint required"}
        </Badge>
      </div>
    </section>
  );
}
