import "server-only";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CoachStatus } from "@/lib/types";

export async function setCoachStatus(email: string, status: CoachStatus) {
  "use server";

  await requireAdmin();
  if (status !== "approved" && status !== "rejected") {
    throw new Error("Invalid coach status");
  }
  const { error } = await createAdminClient().rpc("set_coach_status", {
    p_email: email,
    p_status: status,
  });
  if (error) throw error;
  revalidatePath("/coaches");
  revalidatePath("/");
}
