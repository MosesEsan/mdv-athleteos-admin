import "server-only";

import { createClient } from "@supabase/supabase-js";

import { requireAdmin } from "@/lib/auth";
import { getPublicSupabaseConfig } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const MOBILE_RECOVERY_URL = "athleteostraining://auth/callback";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CoachPasswordResetState = { sent?: boolean; error?: string };

export async function sendCoachPasswordReset(
  coachId: string,
  _state: CoachPasswordResetState,
): Promise<CoachPasswordResetState> {
  "use server";

  void _state;
  await requireAdmin();
  if (!UUID.test(coachId)) return { error: "Coach account not found." };

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", coachId)
    .eq("role", "coach")
    .maybeSingle();
  if (profileError || !profile) return { error: "Coach account not found." };

  const { data, error: userError } = await admin.auth.admin.getUserById(coachId);
  if (userError || !data.user?.email) return { error: "Coach account not found." };

  const { url, anonKey } = getPublicSupabaseConfig();
  const auth = createClient(url, anonKey, {
    auth: { flowType: "implicit", autoRefreshToken: false, persistSession: false },
  });
  const { error } = await auth.auth.resetPasswordForEmail(data.user.email, {
    redirectTo: MOBILE_RECOVERY_URL,
  });
  if (error) return { error: "Could not send the reset link. Try again later." };
  return { sent: true };
}
