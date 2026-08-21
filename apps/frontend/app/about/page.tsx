import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRightIcon, GlobeIcon, LockClosedIcon, RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <><Header /><main className="page-shell"><section className="page-hero center"><div className="container"><span className="eyebrow"><RocketIcon /> About PowerChain</span><h1 className="section-title">Infrastructure for transparent, wallet-controlled capital.</h1><p className="section-copy">PowerChain is building an operating layer for tokenized renewable energy, infrastructure, community, and real-world project launches on-chain.</p></div></section><section className="section"><div className="container content-grid"><div><span className="eyebrow"><GlobeIcon /> Mission</span><h2 className="section-title">Connect capital to measurable real-world outcomes.</h2></div><div className="content-card"><h2>Built around control and verification.</h2><p>PowerChain separates preparation from execution. Software and AI can organize information, validate configuration, simulate transactions, and prepare requests. Only the appropriate authorized wallet can approve and sign consequential on-chain actions.</p><p>That boundary is designed to support professional launch operations without turning the application into a custodian.</p></div></div></section><section id="contact" className="section section-soft"><div className="container content-grid"><div><span className="eyebrow"><LockClosedIcon /> Work with PowerChain</span><h2 className="section-title">Launch a renewable or infrastructure initiative.</h2></div><div className="content-card"><p>Enterprise programs can use dedicated onboarding, launch architecture support, custom integrations, and controlled operational workflows.</p><Link href="/pricing" className="button button-primary">View pricing <ArrowRightIcon /></Link></div></div></section></main><Footer /></>;
}
