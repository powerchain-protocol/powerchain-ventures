import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Explore, Products } from "@/components/sections";
import { LaunchLifecycle } from "@/components/launch-lifecycle";
import { Pricing } from "@/components/pricing";
import { HowItWorks } from "@/components/how-it-works";
import { Process } from "@/components/process";
import { GetStarted } from "@/components/get-started";
import { Renewables } from "@/components/renewables";
import { Partnerships } from "@/components/partnerships";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return <><Header /><main><Hero /><LaunchLifecycle /><Explore /><HowItWorks /><Products /><Process /><Renewables /><Pricing /><GetStarted /><Partnerships /><FAQ /></main><Footer /></>;
}
