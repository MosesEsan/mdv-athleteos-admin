import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

const APP_PATH = "/athleteos/admin";

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.clone();
  destination.search = "";

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    destination.pathname = `${APP_PATH}/forgot-password`;
    destination.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(destination);
  }

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    destination.pathname = `${APP_PATH}/forgot-password`;
    destination.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(destination);
  }

  if (!isAdminEmail(data.user.email, getAdminEmails())) {
    await supabase.auth.signOut();
    destination.pathname = `${APP_PATH}/not-authorised`;
    return NextResponse.redirect(destination);
  }

  destination.pathname = `${APP_PATH}/reset-password`;
  return NextResponse.redirect(destination);
}
