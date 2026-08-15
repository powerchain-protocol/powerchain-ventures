import Image from "next/image";

type LogoTone = "dark" | "light";

type PowerChainMarkProps = {
  size?: number;
  tone?: LogoTone;
  priority?: boolean;
  className?: string;
};

export function PowerChainMark({
  size = 42,
  tone = "dark",
  priority = false,
  className = "",
}: PowerChainMarkProps) {
  return (
    <Image
      src="/assets/brand/powerchain-mark-dark.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority={priority}
      className={`powerchain-mark powerchain-mark-${tone} ${className}`.trim()}
      sizes={`${size}px`}
    />
  );
}

type PowerChainLogoProps = {
  compact?: boolean;
  tone?: LogoTone;
  priority?: boolean;
  className?: string;
};

export function PowerChainLogo({
  compact = false,
  tone = "dark",
  priority = false,
  className = "",
}: PowerChainLogoProps) {
  return (
    <span
      className={`brand brand-${tone} ${compact ? "brand-compact" : ""} ${className}`.trim()}
      aria-label="PowerChain Launchpad"
    >
      <PowerChainMark
        size={compact ? 36 : 42}
        tone={tone}
        priority={priority}
      />
      {!compact && (
        <span className="brand-copy">
          <strong>PowerChain</strong>
          <span>Launchpad</span>
        </span>
      )}
    </span>
  );
}
