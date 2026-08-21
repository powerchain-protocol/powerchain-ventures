import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Partnerships } from "@/components/partnerships";
export const metadata: Metadata = { title: "Partners" };
export default function Page(){return <><Header/><main><section className="page-hero center"><div className="container"><span className="eyebrow">Ecosystem</span><h1 className="section-title">Composable infrastructure, integrated deliberately.</h1><p className="section-copy">PowerChain is designed to integrate with blockchain, oracle, RPC, liquidity, payment, and vesting infrastructure through explicit adapters and clear source boundaries.</p></div></section><Partnerships/></main><Footer/></>}
