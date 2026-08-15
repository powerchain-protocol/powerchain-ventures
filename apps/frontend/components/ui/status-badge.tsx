import type {
  StatusDescriptor,
} from "../../types/status";
import {
  Badge,
  type BadgeTone,
} from "./badge";

type Props =
  | {
      status: StatusDescriptor;
      className?: string;
      label?: never;
      tone?: never;
    }
  | {
      status?: never;
      label: string;
      tone?: BadgeTone;
      className?: string;
    };

export function StatusBadge(props: Props) {
  const label =
    props.status?.label ?? props.label;
  const tone =
    props.status?.tone ??
    props.tone ??
    "neutral";

  return (
    <Badge
      tone={tone}
      dot
      className={props.className ?? ""}
    >
      {label}
    </Badge>
  );
}
