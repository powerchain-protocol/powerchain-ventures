import "./styles.css";
import type { Metadata } from "next";
import {Providers} from "./providers";
export const metadata: Metadata = {title:{default:"PowerChain Launchpad",template:"%s | PowerChain"},description:"Buy, claim, transfer and manage PWRC and Solana Token-2022 sales.",applicationName:"PowerChain Launchpad",icons:{icon:[{url:"/favicon.ico"},{url:"/assets/pwrc/favicon-32.png",sizes:"32x32",type:"image/png"}],apple:"/assets/pwrc/apple-touch-icon.png"},manifest:"/manifest.webmanifest"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}
