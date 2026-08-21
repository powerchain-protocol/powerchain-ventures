"use client";

import Link from "next/link";
import { HamburgerMenuIcon, Cross2Icon, DotFilledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Logo } from "@powerchain/components/logo";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAVIGATION } from "@/constants/navigation";
import { ThemeToggle } from "./theme-toggle";
import { WalletButton } from "./wallet/wallet-button";
import { WalletConnectModal } from "./wallet/wallet-connect-modal";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="site-announcement"><div className="container"><span><DotFilledIcon/> Solana infrastructure operational</span><span className="announcement-divider"/><span>Wallet-controlled execution · AI cannot sign</span><Link href="/about">Trust model <ArrowRightIcon/></Link></div></div>
    <header className="site-header"><div className="container header-inner"><Logo/>
      <nav className="desktop-nav" aria-label="Primary navigation">{PRIMARY_NAVIGATION.map((link)=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <div className="header-actions"><span className="network-pill"><DotFilledIcon/> Mainnet</span><ThemeToggle/><Button asChild variant="outline" size="sm" className="header-signin"><Link href="/auth/login">Sign in</Link></Button><Button asChild size="sm" className="header-create"><Link href="/launch/create">Create launch</Link></Button><WalletButton/><button className="icon-button mobile-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?<Cross2Icon/>:<HamburgerMenuIcon/>}</button></div>
    </div>{open?<nav className="mobile-nav container" aria-label="Mobile navigation">{PRIMARY_NAVIGATION.map((link)=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}<Link href="/launch/create" onClick={()=>setOpen(false)}>Create Launch</Link><Link href="/auth/login" onClick={()=>setOpen(false)}>Sign in</Link></nav>:null}</header><WalletConnectModal/></>;
}
