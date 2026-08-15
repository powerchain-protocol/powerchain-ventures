"use client";

import {
  createAuthClient,
} from "better-auth/react";

export const betterAuthClient =
  createAuthClient({
    baseURL:
      typeof window !== "undefined"
        ? window.location.origin
        : undefined,
    basePath: "/api/auth",
  });
