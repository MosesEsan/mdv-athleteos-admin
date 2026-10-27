import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServiceRoleConfig } from "@/lib/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getServiceRoleConfig();
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
