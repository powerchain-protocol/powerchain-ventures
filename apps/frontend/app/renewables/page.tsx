import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Renewables } from "@/components/renewables";
import { Explore } from "@/components/sections";
export const metadata: Metadata = { title: "Renewables" };
export default function Page(){return <><Header/><main><Renewables/><Explore/></main><Footer/></>}
