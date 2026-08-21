import { Suspense } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Renewables } from "@/components/renewables";
import { Partnerships } from "@/components/partnerships";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
export default function Page(){return <><Header/><main><Hero/><Suspense fallback={<section className="market-section"><div className="market-wrap">Loading launches…</div></section>}><Projects/></Suspense><Renewables/><Partnerships/><FAQ/></main><Footer/></>}
