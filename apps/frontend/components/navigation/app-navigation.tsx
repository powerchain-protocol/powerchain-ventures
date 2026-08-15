"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  Dropdown,
  DropdownItem,
} from "../ui/dropdown";

const primaryLinks = [
  ["/sales", "Sales"],
  ["/dashboard", "Dashboard"],
  ["/claims", "Claims"],
  ["/transactions", "Activity"],
  ["/docs", "Docs"],
] as const;

const secondaryLinks = [
  ["/analytics", "Analytics"],
  ["/wallet", "Wallet Center"],
  ["/integration", "Integrations"],
  ["/settings", "Settings"],
  ["/security", "Security"],
] as const;

function isActive(
  pathname: string,
  href: string,
) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function AppNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const secondaryActive =
    secondaryLinks.some(([href]) =>
      isActive(pathname, href),
    );

  return (
    <div className="app-navigation">
      <button
        type="button"
        className="nav-toggle"
        aria-label={
          open
            ? "Close navigation"
            : "Open navigation"
        }
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() =>
          setOpen(value => !value)
        }
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="primary-navigation"
        className={open ? "open" : ""}
        aria-label="Primary navigation"
      >
        {primaryLinks.map(
          ([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                isActive(pathname, href)
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ),
        )}

        <Dropdown
          label="Open secondary navigation"
          trigger={
            <span
              className="nav-more-trigger"
              aria-current={
                secondaryActive
                  ? "page"
                  : undefined
              }
            >
              More{" "}
              <span aria-hidden="true">
                ⌄
              </span>
            </span>
          }
        >
          {secondaryLinks.map(
            ([href, label]) => (
              <DropdownItem key={href}>
                <Link
                  href={href}
                  role="menuitem"
                  aria-current={
                    isActive(pathname, href)
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              </DropdownItem>
            ),
          )}
        </Dropdown>
      </nav>
    </div>
  );
}
