import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
export const metadata: Metadata = { title: "Pricing" };
export default function Page(){return <><Header/><main><section className="page-hero center"><div className="container"><span className="eyebrow">PowerChain SaaS</span><h1 className="section-title">Software pricing built for launch operations.</h1><p className="section-copy">Choose a software plan independently from blockchain network fees and disclosed transaction-specific costs.</p></div></section><Pricing/><FAQ/></main><Footer/></>}
