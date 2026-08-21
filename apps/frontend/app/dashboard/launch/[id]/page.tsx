"use client";
import { use } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LaunchControlPlane } from "@/components/dashboard/launch-control-plane";
export default function LaunchPage({params}:{params:Promise<{id:string}>}){const{id}=use(params);return <AuthGuard><DashboardShell><LaunchControlPlane launchId={id}/></DashboardShell></AuthGuard>}
