import Link from "next/link";

import { requestPasswordReset } from "@/app/actions/password-recovery";
import { PasswordRecoveryForm } from "@/components/password-recovery-form";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const invalidLink = (await searchParams).error === "invalid_link";
  return <main className="authPage"><section className="authCard"><p className="eyebrow">AthleteOS Training</p><h1>Reset your password</h1><p>Enter your admin email and we will send a link to choose a new password.</p>{invalidLink ? <p className="error" role="alert">This reset link is invalid or expired. Request a new one.</p> : null}<PasswordRecoveryForm action={requestPasswordReset} /><Link className="authTextLink" href="/sign-in">Back to sign in</Link></section></main>;
}
