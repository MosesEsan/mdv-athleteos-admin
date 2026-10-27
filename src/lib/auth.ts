import "server-only";

import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

const APP_PATH = "/athleteos";

export async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect(`${APP_PATH}/sign-in`);
  if (!isAdminEmail(data.user.email, getAdminEmails())) redirect(`${APP_PATH}/not-authorised`);

  return data.user;
}
