import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export type SignInState = { error?: string; sent?: boolean };

export async function sendMagicLink(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !isAdminEmail(email, getAdminEmails())) {
    return { error: "Not authorised" };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { sent: true };
}

export async function signOut() {
  "use server";

  await requireAdmin();
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
