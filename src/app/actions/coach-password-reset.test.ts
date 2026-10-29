import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const getUserById = vi.fn();
  const resetPasswordForEmail = vi.fn();
  return {
    maybeSingle, getUserById, resetPasswordForEmail,
    requireAdmin: vi.fn(),
    createClient: vi.fn(() => ({ auth: { resetPasswordForEmail } })),
    createAdminClient: vi.fn(() => ({
      from: vi.fn(() => ({ select: vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) })) })) })),
      auth: { admin: { getUserById } },
    })),
  };
});

vi.mock("server-only", () => ({}));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/env", () => ({ getPublicSupabaseConfig: () => ({ url: "https://example.supabase.co", anonKey: "anon" }) }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));

import { sendCoachPasswordReset } from "./coach-password-reset";

const coachId = "11111111-1111-4111-8111-111111111111";

describe("coach password reset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue({ email: "admin@example.com" });
    mocks.maybeSingle.mockResolvedValue({ data: { id: coachId }, error: null });
    mocks.getUserById.mockResolvedValue({ data: { user: { email: "coach@example.com" } }, error: null });
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("requires an admin session before looking up a coach", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Not authorised"));
    await expect(sendCoachPasswordReset(coachId, {})).rejects.toThrow("Not authorised");
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("refuses a user without a coach profile", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
    await expect(sendCoachPasswordReset(coachId, {})).resolves.toEqual({ error: "Coach account not found." });
    expect(mocks.getUserById).not.toHaveBeenCalled();
    expect(mocks.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("sends a link to the verified coach email using the mobile callback", async () => {
    await expect(sendCoachPasswordReset(coachId, {})).resolves.toEqual({ sent: true });
    expect(mocks.getUserById).toHaveBeenCalledWith(coachId);
    expect(mocks.createClient).toHaveBeenCalledWith("https://example.supabase.co", "anon", {
      auth: { flowType: "implicit", autoRefreshToken: false, persistSession: false },
    });
    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("coach@example.com", {
      redirectTo: "athleteostraining://auth/callback",
    });
  });

  it("does not show a sent state when Supabase rejects the email", async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: new Error("rate limited") });
    await expect(sendCoachPasswordReset(coachId, {})).resolves.toEqual({ error: "Could not send the reset link. Try again later." });
  });
});
