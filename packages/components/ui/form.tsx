import * as React from "react";
import { cn } from "../lib/utils";
export function FormField({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("ui-form-field", className)} {...props} />; }
export function FormLabel({ className, ...props }: React.ComponentProps<"label">) { return <label className={cn("ui-form-label", className)} {...props} />; }
export function FormDescription({ className, ...props }: React.ComponentProps<"p">) { return <p className={cn("ui-form-description", className)} {...props} />; }
export function FormMessage({ className, ...props }: React.ComponentProps<"p">) { return <p role="alert" className={cn("ui-form-message", className)} {...props} />; }
export function FormGrid({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("ui-form-grid", className)} {...props} />; }
