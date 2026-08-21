"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

export const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(function Avatar({ className, ...props }, ref) {
  return <AvatarPrimitive.Root ref={ref} className={cn("ui-avatar", className)} {...props} />;
});
export const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(function AvatarImage({ className, ...props }, ref) {
  return <AvatarPrimitive.Image ref={ref} className={cn("ui-avatar-image", className)} {...props} />;
});
export const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(function AvatarFallback({ className, ...props }, ref) {
  return <AvatarPrimitive.Fallback ref={ref} className={cn("ui-avatar-fallback", className)} {...props} />;
});
