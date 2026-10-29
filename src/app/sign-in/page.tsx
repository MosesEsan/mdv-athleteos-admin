import { redirect } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import { SignInForm } from "@/components/sign-in-form";
import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export default async function SignInPage() {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    redirect(isAdminEmail(data.user.email, getAdminEmails()) ? "/" : "/not-authorised");
  }
  return <main className="authPage"><section className="authCard"><p className="eyebrow">AthleteOS Training</p><h1>Admin sign in</h1><p>Sign in with your admin email and password.</p><SignInForm action={signIn} /></section></main>;
}
