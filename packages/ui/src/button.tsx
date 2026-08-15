import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  block: boolean,
) {
  return [
    "pc-button",
    `pc-button-${variant}`,
    `pc-button-${size}`,
    block
      ? "pc-button-block"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}) {
  return (
    <button
      {...props}
      className={`${classes(
        variant,
        size,
        block,
      )} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  block = false,
  children,
  className = "",
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${classes(
        variant,
        size,
        block,
      )} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
