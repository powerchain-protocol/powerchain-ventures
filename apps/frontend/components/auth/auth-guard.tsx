"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);

  if (loading || !user) return <main className="container dashboard-page"><div className="auth-loading" role="status">Checking secure session…</div></main>;
  return <>{children}</>;
}
