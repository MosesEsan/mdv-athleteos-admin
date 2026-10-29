import "server-only";

import { headers } from "next/headers";

import { requireAdmin } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

const APP_PATH = "/athleteos/admin";
const DEFAULT_ORIGIN = "https://www.mesandigitalventures.com";
const ALLOWED_ORIGINS = new Set([
  "https://www.mesandigitalventures.com",
  "https://mesandigitalventures.com",
  "https://mdv-athleteos-admin.vercel.app",
  "http://localhost:3000",
]);

export type RecoveryState = { sent?: boolean; saved?: boolean; error?: string };

export async function requestPasswordReset(_state: RecoveryState, formData: FormData): Promise<RecoveryState> {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address." };

  if (isAdminEmail(email, getAdminEmails())) {
    const requestOrigin = (await headers()).get("origin") ?? "";
    const origin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : DEFAULT_ORIGIN;
    const supabase = await createAuthClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}${APP_PATH}/auth/recovery`,
    });
  }

  return { sent: true };
}

export async function saveNewPassword(_state: RecoveryState, formData: FormData): Promise<RecoveryState> {
  "use server";

  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters for your password." };
  if (password !== confirm) return { error: "The passwords do not match." };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Could not save the password. Request a new link and try again." };
  await supabase.auth.signOut();
  return { saved: true };
}
