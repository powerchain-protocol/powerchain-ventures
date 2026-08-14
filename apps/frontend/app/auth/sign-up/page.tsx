import {AuthShell} from "../../../components/auth/auth-shell";import {SignUpForm} from "../../../components/auth/sign-up-form";
export const metadata={title:"Create account"};export default function SignUpPage(){return <AuthShell title="Create your account" subtitle="Set up your PowerChain account. Wallet custody always stays with you."><SignUpForm/></AuthShell>}
