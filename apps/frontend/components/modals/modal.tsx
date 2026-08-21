"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@powerchain/components/dialog";

export function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: React.ReactNode }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><div><DialogTitle>{title}</DialogTitle>{description ? <DialogDescription>{description}</DialogDescription> : null}</div><DialogClose className="close-button" aria-label="Close"><Cross2Icon /></DialogClose></DialogHeader>{children}</DialogContent></Dialog>;
}
