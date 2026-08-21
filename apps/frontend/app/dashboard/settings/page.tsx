"use client";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsForm } from "@/components/dashboard/settings-form";
export default function Page(){return <AuthGuard><DashboardShell><section className="dashboard-section-heading"><div><span className="eyebrow">System</span><h1>Settings</h1><p>Configure notifications, timezone, wallet behavior, and operator preferences.</p></div></section><SettingsForm/></DashboardShell></AuthGuard>}
