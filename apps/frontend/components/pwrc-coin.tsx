import Image from "next/image";

export function PwrcCoin({size=40,className="",priority=false}:{size?:number;className?:string;priority?:boolean}){
  return <span className={`pwrc-coin ${className}`} style={{width:size,height:size}} aria-hidden="true"><Image src="/assets/pwrc/pwrc.png" alt="" width={size} height={size} priority={priority}/></span>;
}
