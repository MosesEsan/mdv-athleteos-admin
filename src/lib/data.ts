import "server-only";

import type { User } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Coach, CoachStatus, InviteCode } from "@/lib/types";

async function listAllUsers(): Promise<User[]> {
  const supabase = createAdminClient();
  const users: User[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

export async function getCoaches(status: CoachStatus): Promise<Coach[]> {
  const supabase = createAdminClient();
  const [profilesResult, linksResult, users] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, business_name, coach_status")
      .eq("role", "coach")
      .eq("coach_status", status)
      .order("full_name"),
    supabase.from("coach_clients").select("coach_id").eq("status", "active"),
    listAllUsers(),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (linksResult.error) throw linksResult.error;

  const usersById = new Map(users.map((user) => [user.id, user]));
  const activeCount = new Map<string, number>();
  linksResult.data.forEach(({ coach_id }) =>
    activeCount.set(coach_id, (activeCount.get(coach_id) ?? 0) + 1),
  );

  return profilesResult.data.flatMap((profile) => {
    const user = usersById.get(profile.id);
    if (!user?.email) return [];
    return [
      {
        id: profile.id,
        fullName: profile.full_name,
        businessName: profile.business_name,
        email: user.email,
        signedUpAt: user.created_at,
        activeClients: activeCount.get(profile.id) ?? 0,
        status,
      },
    ];
  });
}

export async function getInviteCodes(): Promise<InviteCode[]> {
  const { data, error } = await createAdminClient()
    .from("coach_invite_codes")
    .select("code, note, used_count, max_uses, expires_at, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOverview() {
  const supabase = createAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [pending, approved, rejected, clients, sessions] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "coach").eq("coach_status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "coach").eq("coach_status", "approved"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "coach").eq("coach_status", "rejected"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("workout_sessions").select("id", { count: "exact", head: true }).gte("finished_at", sevenDaysAgo),
  ]);

  for (const result of [pending, approved, rejected, clients, sessions]) {
    if (result.error) throw result.error;
  }

  return {
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
    clients: clients.count ?? 0,
    sessions: sessions.count ?? 0,
  };
}
