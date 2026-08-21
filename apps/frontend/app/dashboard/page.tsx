"use client";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LaunchDashboard } from "@/components/dashboard/launch-dashboard";
function DashboardContent(){const{user}=useAuth();return <DashboardShell><LaunchDashboard operator={user?.name||"operator"}/></DashboardShell>}
export default function Dashboard(){return <AuthGuard><DashboardContent/></AuthGuard>}
