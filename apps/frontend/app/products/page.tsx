import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Products } from "@/components/sections";
import { FAQ } from "@/components/faq";
export const metadata: Metadata = { title: "Products" };
export default function Page(){return <><Header/><main><section className="page-hero center"><div className="container"><span className="eyebrow">PowerChain products</span><h1 className="section-title">One operating layer for the complete launch lifecycle.</h1><p className="section-copy">From token configuration and capital participation to treasury settlement, vesting, claims, analytics, and authority management.</p></div></section><Products/><FAQ/></main><Footer/></>}
