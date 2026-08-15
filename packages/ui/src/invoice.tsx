import {
  formatUsd,
} from "@powerchain/utils/formats";
import {
  Badge,
} from "./badge.js";

export type InvoiceLine = {
  label: string;
  valueUsd: number;
  detail?: string;
};

export function Invoice({
  title = "Payment summary",
  lines,
  totalUsd,
  status = "Review",
}: {
  title?: string;
  lines: InvoiceLine[];
  totalUsd: number;
  status?: string;
}) {
  return (
    <section className="pc-invoice">
      <header>
        <div>
          <span className="eyebrow">
            Invoice
          </span>
          <h3>{title}</h3>
        </div>
        <Badge tone="neutral">
          {status}
        </Badge>
      </header>
      <div className="pc-invoice-lines">
        {lines.map(line => (
          <div
            key={line.label}
            className="pc-invoice-line"
          >
            <span>
              <b>{line.label}</b>
              {line.detail ? (
                <small>
                  {line.detail}
                </small>
              ) : null}
            </span>
            <strong>
              {formatUsd(
                line.valueUsd,
              )}
            </strong>
          </div>
        ))}
      </div>
      <footer>
        <span>Total</span>
        <strong>
          {formatUsd(totalUsd)}
        </strong>
      </footer>
    </section>
  );
}
