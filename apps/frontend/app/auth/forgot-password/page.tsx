import {AuthShell} from "../../../components/auth/auth-shell";import {ForgotPasswordForm} from "../../../components/auth/forgot-password-form";
export const metadata={title:"Reset password"};export default function ForgotPassword(){return <AuthShell title="Reset your password" subtitle="Enter your account email and we’ll send a secure recovery link."><ForgotPasswordForm/></AuthShell>}
