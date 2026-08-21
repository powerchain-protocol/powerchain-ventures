import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
export default function NotFound(){return <><Header/><main className="not-found"><div className="container"><span className="eyebrow">404 · Not found</span><h1 className="section-title">This PowerChain page does not exist.</h1><p className="section-copy" style={{marginInline:"auto"}}>The route may have moved or the address may be incomplete.</p><Link className="button button-primary" href="/"><ArrowLeftIcon/> Back to PowerChain</Link></div></main><Footer/></>}
