"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;
export const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(function SelectTrigger({ className, children, ...props }, ref) {
  return <SelectPrimitive.Trigger ref={ref} className={cn("ui-select-trigger", className)} {...props}>{children}<SelectPrimitive.Icon className="ui-select-chevron">⌄</SelectPrimitive.Icon></SelectPrimitive.Trigger>;
});
export const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(function SelectContent({ className, children, position = "popper", ...props }, ref) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} className={cn("ui-select-content", className)} position={position} {...props}><SelectPrimitive.Viewport className="ui-select-viewport">{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>;
});
export const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(function SelectItem({ className, children, ...props }, ref) {
  return <SelectPrimitive.Item ref={ref} className={cn("ui-select-item", className)} {...props}><SelectPrimitive.ItemIndicator className="ui-select-indicator">✓</SelectPrimitive.ItemIndicator><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>;
});
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = SelectPrimitive.Separator;
