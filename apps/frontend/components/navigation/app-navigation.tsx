"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["/", "Launchpad"],
  ["/sales", "Sales"],
  ["/dashboard", "Dashboard"],
  ["/analytics", "Analytics"],
  ["/integration", "Integration"],
  ["/wallet", "Wallet"],
  ["/claims", "Claims"],
  ["/transactions", "Transactions"],
  ["/create", "Create Sale"],
  ["/account", "Account"],
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="app-navigation">
      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="primary-navigation" className={open ? "open" : ""} aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link key={href} href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
