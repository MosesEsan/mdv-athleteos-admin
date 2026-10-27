import "server-only";

import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/sign-in");
  if (!isAdminEmail(data.user.email, getAdminEmails())) redirect("/not-authorised");

  return data.user;
}
