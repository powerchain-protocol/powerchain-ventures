import Image from "next/image";
export function PowerChainLogo({compact=false}:{compact?:boolean}) { return <div className="brand"><Image src="/assets/pwrc/logo-green.png" alt="PowerChain" width={compact?38:44} height={compact?38:44} priority/><div><strong>PowerChain</strong>{!compact&&<span>Launchpad</span>}</div></div> }
