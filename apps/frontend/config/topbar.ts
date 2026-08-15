export type TopbarTone =
  | "info"
  | "success"
  | "warning"
  | "neutral";

export type TopbarConfig = {
  enabled: boolean;
  releaseLabel: string;
  message: string;
  linkLabel?: string;
  linkHref?: string;
  dismissible: boolean;
  tone: TopbarTone;
};

export const TOPBAR_CONFIG:
  Readonly<TopbarConfig> = Object.freeze({
    enabled: true,
    releaseLabel: "RC.1",
    message:
      "PowerChain Launchpad RC.1 — mainnet-beta readiness, wallet authentication and API transport upgrades are now available.",
    linkLabel: "View release notes",
    linkHref: "/docs",
    dismissible: true,
    tone: "info",
  });

export function topbarEnabled(
  env:
    | string
    | undefined =
    process.env
      .NEXT_PUBLIC_TOPBAR_ENABLED,
): boolean {
  if (env == null || env === "") {
    return TOPBAR_CONFIG.enabled;
  }

  return ![
    "0",
    "false",
    "off",
    "disabled",
  ].includes(
    env.trim().toLowerCase(),
  );
}
