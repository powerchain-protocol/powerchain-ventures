"use client";
import { use } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LaunchReview } from "@/components/campaign/launch-review";
export default function Page({params}:{params:Promise<{id:string}>}){const{id}=use(params);return <AuthGuard><DashboardShell><LaunchReview campaignId={id}/></DashboardShell></AuthGuard>}
