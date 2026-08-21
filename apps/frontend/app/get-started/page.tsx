import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GetStarted } from "@/components/get-started";
import { HowItWorks } from "@/components/how-it-works";
import { Process } from "@/components/process";
export const metadata:Metadata={title:"Get Started"};
export default function Page(){return <><Header/><main><section className="page-hero center"><div className="container"><span className="eyebrow">PowerChain Launch OS</span><h1 className="section-title">Create a campaign with explicit controls from the first draft.</h1><p className="section-copy">Start with project configuration, then validate, review, simulate and sign only when the launch is ready.</p></div></section><HowItWorks/><Process/><GetStarted/></main><Footer/></>}
