"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  TOPBAR_CONFIG,
  topbarEnabled,
} from "../config/topbar";
import {
  Badge,
} from "./ui/badge";

const DISMISS_KEY =
  "powerchain.topbar.dismissed.rc1";

export function Topbar() {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    if (!topbarEnabled()) {
      setVisible(false);
      return;
    }

    if (
      TOPBAR_CONFIG.dismissible &&
      localStorage.getItem(
        DISMISS_KEY,
      ) === "1"
    ) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside
      className={
        `topbar topbar-${TOPBAR_CONFIG.tone}`
      }
      aria-label="Release information"
    >
      <div className="topbar-inner">
        <Badge
          tone={
            TOPBAR_CONFIG.tone ===
            "neutral"
              ? "neutral"
              : TOPBAR_CONFIG.tone
          }
        >
          {TOPBAR_CONFIG.releaseLabel}
        </Badge>

        <p>
          {TOPBAR_CONFIG.message}
        </p>

        {TOPBAR_CONFIG.linkHref &&
        TOPBAR_CONFIG.linkLabel ? (
          <Link
            href={
              TOPBAR_CONFIG.linkHref
            }
            className="topbar-link"
          >
            {TOPBAR_CONFIG.linkLabel}
          </Link>
        ) : null}

        {TOPBAR_CONFIG.dismissible ? (
          <button
            type="button"
            className="topbar-dismiss"
            aria-label="Hide release information"
            onClick={() => {
              localStorage.setItem(
                DISMISS_KEY,
                "1",
              );
              setVisible(false);
            }}
          >
            ×
          </button>
        ) : null}
      </div>
    </aside>
  );
}
