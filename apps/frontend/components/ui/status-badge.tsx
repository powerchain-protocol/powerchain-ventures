import type { StatusDescriptor } from "../../types/status";

export function StatusBadge({ status, className = "" }: { status: StatusDescriptor; className?: string }) {
  return <span className={`status-badge ${status.tone} ${className}`.trim()}><i aria-hidden="true" />{status.label}</span>;
}
