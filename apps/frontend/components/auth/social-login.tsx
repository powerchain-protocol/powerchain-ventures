"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  authService,
} from "../../services/auth-service";
import type {
  SocialAuthProvider,
} from "../../types/accounts";
import {
  Badge,
} from "../ui/badge";
import {
  Button,
} from "../ui/button";

const labels:
  Record<SocialAuthProvider, string> = {
    google: "Google",
    github: "GitHub",
    discord: "Discord",
    apple: "Apple",
  };

export function SocialLogin() {
  const [providers, setProviders] =
    useState<SocialAuthProvider[]>([]);
  const [busy, setBusy] =
    useState<SocialAuthProvider | null>(
      null,
    );

  useEffect(() => {
    let live = true;

    void authService
      .providers()
      .then(result => {
        if (live) {
          setProviders(
            result.auth.socialProviders,
          );
        }
      })
      .catch(() => {});

    return () => {
      live = false;
    };
  }, []);

  if (!providers.length) {
    return null;
  }

  return (
    <div className="social-login-grid">
      {providers.map(provider => (
        <Button
          key={provider}
          type="button"
          variant="secondary"
          disabled={busy !== null}
          onClick={async () => {
            setBusy(provider);
            try {
              await authService.social(
                provider,
              );
            } finally {
              setBusy(null);
            }
          }}
        >
          <span className="social-login-mark">
            {provider === "google"
              ? "G"
              : provider === "github"
                ? "GH"
                : provider === "discord"
                  ? "D"
                  : ""}
          </span>
          Continue with {labels[provider]}
          {provider === providers[0] ? (
            <Badge tone="neutral">
              Social
            </Badge>
          ) : null}
        </Button>
      ))}
    </div>
  );
}
