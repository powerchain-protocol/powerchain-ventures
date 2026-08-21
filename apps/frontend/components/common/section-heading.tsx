import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, centered = false, className }: { eyebrow?: string; title: string; description?: string; centered?: boolean; className?: string }) {
  return <div className={cn(centered && "center-heading", className)}>{eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}<h2 className="section-title">{title}</h2>{description ? <p className="section-copy">{description}</p> : null}</div>;
}
