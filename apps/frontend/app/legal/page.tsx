import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const metadata: Metadata = { title: "Legal" };

export default function LegalPage() {
  return <><Header /><main className="page-shell"><section className="page-hero center"><div className="container"><span className="eyebrow">Legal center</span><h1 className="section-title">PowerChain legal information.</h1><p className="section-copy">Review the policies and risk information applicable to the PowerChain website, Launchpad software, and marketplace experience.</p></div></section><section className="section"><div className="container pricing-grid"><Link className="content-card" href="/legal/privacy"><h2>Privacy Policy</h2><p>How PowerChain handles website, account, wallet-address, and service data.</p></Link><Link className="content-card" href="/legal/terms"><h2>Terms of Service</h2><p>Terms governing access to the PowerChain software and services.</p></Link><Link className="content-card" href="/legal/risk-disclosure"><h2>Risk Disclosure</h2><p>Important blockchain, token, project, transaction, and market risks.</p></Link></div></section></main><Footer /></>;
}
