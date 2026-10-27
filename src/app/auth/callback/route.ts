import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth-policy";
import { getAdminEmails } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = request.nextUrl.clone();
  destination.pathname = "/";
  destination.search = "";

  if (!code) {
    destination.pathname = "/sign-in";
    destination.searchParams.set("error", "missing_code");
    return NextResponse.redirect(destination);
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    destination.pathname = "/sign-in";
    destination.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(destination);
  }

  const { data } = await supabase.auth.getUser();
  if (!isAdminEmail(data.user?.email, getAdminEmails())) {
    await supabase.auth.signOut();
    destination.pathname = "/not-authorised";
  }

  return NextResponse.redirect(destination);
}
