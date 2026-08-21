import * as React from "react";
import { cn } from "../lib/utils";
export function Pagination({ className, ...props }: React.ComponentProps<"nav">) { return <nav aria-label="Pagination" className={cn("ui-pagination", className)} {...props} />; }
export function PaginationList({ className, ...props }: React.ComponentProps<"ul">) { return <ul className={cn("ui-pagination-list", className)} {...props} />; }
export function PaginationItem(props: React.ComponentProps<"li">) { return <li {...props} />; }
export function PaginationLink({ active, className, ...props }: React.ComponentProps<"a"> & { active?: boolean }) { return <a aria-current={active ? "page" : undefined} className={cn("ui-pagination-link", active && "is-active", className)} {...props} />; }
