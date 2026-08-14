"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

const items=[
 {href:"/",label:"Home",icon:"⌂"},
 {href:"/sales",label:"Sales",icon:"◈"},
 {href:"/wallet",label:"Wallet",icon:"◉"},
 {href:"/transactions",label:"Activity",icon:"↗"},
 {href:"/account",label:"Account",icon:"○"},
] as const;
export function MobileBottomNav(){const pathname=usePathname();return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{items.map(item=>{const active=item.href==="/"?pathname==="/":pathname===item.href||pathname.startsWith(`${item.href}/`);return <Link key={item.href} href={item.href} aria-current={active?"page":undefined}><span aria-hidden>{item.icon}</span><b>{item.label}</b></Link>})}</nav>}
