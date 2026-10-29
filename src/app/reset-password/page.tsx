import Link from "next/link";

import { saveNewPassword } from "@/app/actions/password-recovery";
import { NewPasswordForm } from "@/components/password-recovery-form";
import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <main className="authPage"><section className="authCard"><h1>Reset link expired</h1><p>Request a new password reset link and open it in this browser.</p><Link className="buttonLink" href="/forgot-password">Request a new link</Link></section></main>;
  if (!isAdminEmail(data.user.email, getAdminEmails())) return <main className="authPage"><section className="authCard"><h1>Not authorised</h1><p>This account does not have access to the admin dashboard.</p><Link className="buttonLink" href="/sign-in">Return to sign in</Link></section></main>;

  return <main className="authPage"><section className="authCard"><p className="eyebrow">AthleteOS Training</p><h1>Choose a new password</h1><p>Set a password for {data.user.email}.</p><NewPasswordForm action={saveNewPassword} /><Link className="authTextLink" href="/sign-in">Back to sign in</Link></section></main>;
}
