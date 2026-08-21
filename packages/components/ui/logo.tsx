import * as React from "react";
type LogoProps = { href?: string; tone?: "dark" | "light" | "auto"; variant?: "brand" | "marketplace"; compact?: boolean; className?: string };
export function Logo({ href = "/", tone = "auto", variant = "brand", compact = false, className = "" }: LogoProps) {
  const content = <span className={`pc-logo pc-logo--${tone} ${compact ? "pc-logo--compact" : ""} ${className}`}>
    <span className="pc-logo__mark-wrap" aria-hidden="true"><img className="pc-logo__mark pc-logo__mark-dark" src="/assets/logo-dark.png" alt=""/><img className="pc-logo__mark pc-logo__mark-light" src="/assets/logo-light.png" alt=""/></span>
    <span className="pc-logo__copy">{variant === "marketplace" ? <><span className="pc-logo__kicker">POWERCHAIN</span><span className="pc-logo__marketplace">MARKETPLACE</span></> : <><span className="pc-logo__word"><strong>Power</strong><span>Chain</span></span><span className="pc-logo__tagline">TOKENIZED RENEWABLES</span></>}</span>
  </span>;
  return href ? <a className="pc-logo-link" href={href} aria-label={variant === "marketplace" ? "PowerChain Marketplace" : "PowerChain"}>{content}</a> : content;
}
