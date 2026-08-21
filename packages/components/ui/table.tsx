import * as React from "react";
import { cn } from "../lib/utils";
export function Table({ className, ...props }: React.ComponentProps<"table">) { return <div className="ui-table-scroll"><table className={cn("ui-table", className)} {...props} /></div>; }
export function TableHeader(props: React.ComponentProps<"thead">) { return <thead {...props} />; }
export function TableBody(props: React.ComponentProps<"tbody">) { return <tbody {...props} />; }
export function TableRow({ className, ...props }: React.ComponentProps<"tr">) { return <tr className={cn("ui-table-row", className)} {...props} />; }
export function TableHead({ className, ...props }: React.ComponentProps<"th">) { return <th className={cn("ui-table-head", className)} {...props} />; }
export function TableCell({ className, ...props }: React.ComponentProps<"td">) { return <td className={cn("ui-table-cell", className)} {...props} />; }
export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) { return <caption className={cn("ui-table-caption", className)} {...props} />; }
