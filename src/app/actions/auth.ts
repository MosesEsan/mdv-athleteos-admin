import "server-only";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export type SignInState = { error?: string };

export async function signIn(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !isAdminEmail(email, getAdminEmails())) {
    return { error: "Not authorised" };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter your password." };

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) return { error: "Email or password is incorrect." };
  if (!isAdminEmail(data.user.email, getAdminEmails())) {
    await supabase.auth.signOut();
    return { error: "Not authorised" };
  }

  redirect("/");
}

export async function signOut() {
  "use server";

  await requireAdmin();
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
