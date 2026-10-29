import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(), updateUser: vi.fn(), signOut: vi.fn(),
  createAuthClient: vi.fn(), requireAdmin: vi.fn(), headers: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/auth-policy", () => ({ isAdminEmail: (email: string | undefined) => email?.toLowerCase() === "admin@example.com" }));
vi.mock("@/lib/env", () => ({ getAdminEmails: () => "admin@example.com" }));
vi.mock("@/lib/supabase/server", () => ({ createAuthClient: mocks.createAuthClient }));

import { requestPasswordReset, saveNewPassword } from "./password-recovery";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("admin password recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockReset();
    mocks.createAuthClient.mockResolvedValue({ auth: mocks });
    mocks.headers.mockResolvedValue(new Headers({ origin: "https://www.mesandigitalventures.com" }));
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
    mocks.updateUser.mockResolvedValue({ error: null });
  });

  it("does not send recovery mail to an address outside the admin allowlist", async () => {
    await expect(requestPasswordReset({}, form({ email: "outsider@example.com" }))).resolves.toEqual({ sent: true });
    expect(mocks.createAuthClient).not.toHaveBeenCalled();
  });

  it("sends an admin to the dedicated recovery callback", async () => {
    await expect(requestPasswordReset({}, form({ email: "ADMIN@example.com" }))).resolves.toEqual({ sent: true });
    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("admin@example.com", {
      redirectTo: "https://www.mesandigitalventures.com/athleteos/admin/auth/recovery",
    });
  });

  it("requires admin authorization before accepting a new password", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Not authorised"));
    await expect(saveNewPassword({}, form({ password: "newpassword", confirm: "newpassword" }))).rejects.toThrow("Not authorised");
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("updates a valid password and signs out", async () => {
    await expect(saveNewPassword({}, form({ password: "newpassword", confirm: "newpassword" }))).resolves.toEqual({ saved: true });
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: "newpassword" });
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });
});
