import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CreateCampaignForm } from "@/components/campaign/create-campaign-form";
export const metadata:Metadata={title:"Create Campaign"};
export default function Page(){return <><Header/><main className="builder-page"><div className="container"><CreateCampaignForm/></div></main><Footer/></>}
