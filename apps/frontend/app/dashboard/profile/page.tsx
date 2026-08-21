"use client";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileCard } from "@/components/dashboard/profile-card";
export default function Page(){return <AuthGuard><DashboardShell><section className="dashboard-section-heading"><div><span className="eyebrow">Account</span><h1>Profile</h1><p>Manage the operator identity used across PowerChain Ventures.</p></div></section><ProfileCard/></DashboardShell></AuthGuard>}
