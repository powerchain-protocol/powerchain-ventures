import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export function Card({
  children,
  className = "",
  interactive = false,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <section
      {...props}
      className={[
        "pc-card",
        interactive
          ? "pc-card-interactive"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="pc-card-header">
      <div>
        {eyebrow ? (
          <span className="pc-card-eyebrow">
            {eyebrow}
          </span>
        ) : null}
        <h2>{title}</h2>
        {description ? (
          <p>{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className="pc-card-action">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function CardBody({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="pc-card-body">
      {children}
    </div>
  );
}
