import "server-only";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateCodeState = { error?: string; code?: string };

export async function createInviteCode(
  _state: CreateCodeState,
  formData: FormData,
): Promise<CreateCodeState> {
  "use server";

  await requireAdmin();
  const note = String(formData.get("note") ?? "").trim();
  const maxUses = Number(formData.get("maxUses"));
  const expiresValue = String(formData.get("expiresInDays") ?? "").trim();
  const expiresInDays = expiresValue === "" ? null : Number(expiresValue);

  if (!note) return { error: "Note is required." };
  if (!Number.isInteger(maxUses) || maxUses < 1) {
    return { error: "Max uses must be a positive whole number." };
  }
  if (expiresInDays !== null && (!Number.isInteger(expiresInDays) || expiresInDays < 1)) {
    return { error: "Expiry must be blank or a positive whole number of days." };
  }

  const expiresAt = expiresInDays === null
    ? null
    : new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await createAdminClient().rpc("create_coach_code", {
    p_note: note,
    p_max_uses: maxUses,
    p_expires_at: expiresAt,
  });
  if (error) return { error: error.message };
  revalidatePath("/invite-codes");
  return { code: data };
}

export async function disableInviteCode(code: string) {
  "use server";

  await requireAdmin();
  const { error } = await createAdminClient()
    .from("coach_invite_codes")
    .update({ expires_at: new Date().toISOString() })
    .eq("code", code);
  if (error) throw error;
  revalidatePath("/invite-codes");
}
