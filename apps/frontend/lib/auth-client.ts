import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include"
  },
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: true,
    refetchWhenOffline: false
  }
});
