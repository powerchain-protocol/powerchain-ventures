"use client";
import { ChevronDownIcon, ClipboardCopyIcon, ExitIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWallet } from "../provider/wallet-provider";
import { useEmbeddedWallet } from "../provider/embedded-wallet-provider";

export function WalletButton() {
  const external = useWallet();
  const embedded = useEmbeddedWallet();
  const address = external.address || embedded.address;
  const connected = Boolean(address);
  const walletName = external.address ? external.walletName : embedded.address ? "Embedded wallet" : null;
  async function disconnect() { if (external.address) await external.disconnect(); if (embedded.authenticated) await embedded.logout(); }
  if (!connected || !address) return <Button className="wallet-button" onClick={() => external.setModalOpen(true)} type="button"><LockClosedIcon /> Connect Wallet</Button>;
  const short = `${address.slice(0, 4)}…${address.slice(-4)}`;
  return <DropdownMenu><DropdownMenuTrigger asChild><Button className="wallet-button" type="button"><span className="wallet-status-dot"/><span>{short}</span><ChevronDownIcon/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="wallet-menu"><DropdownMenuLabel>{walletName || "Solana wallet"}<small>{short}</small></DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuItem onSelect={() => void navigator.clipboard?.writeText(address)}><ClipboardCopyIcon/> Copy address</DropdownMenuItem><DropdownMenuItem onSelect={() => void disconnect()}><ExitIcon/> Disconnect</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}
