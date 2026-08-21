"use client";
import { Button } from "@/components/ui/button";
export default function ErrorBoundary({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="container" style={{minHeight:"65vh",display:"grid",placeItems:"center",padding:"80px 0"}}><div className="content-card" style={{maxWidth:560,textAlign:"center"}}><span className="eyebrow">PowerChain Ventures</span><h1>Something went wrong.</h1><p className="body-copy">The page could not be rendered. No wallet action or on-chain transaction was executed.</p><Button onClick={reset}>Try again</Button></div></main>}
