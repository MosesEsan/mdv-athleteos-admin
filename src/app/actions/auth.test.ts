import { beforeEach, describe, expect, it, vi } from "vitest";

const { signInWithPassword, signOut, createAuthClient, redirect } = vi.hoisted(() => {
  const signInWithPassword = vi.fn();
  const signOut = vi.fn();
  return {
    signInWithPassword,
    signOut,
    createAuthClient: vi.fn(async () => ({ auth: { signInWithPassword, signOut } })),
    redirect: vi.fn((path: string) => { throw new Error(`REDIRECT:${path}`); }),
  };
});

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/auth-policy", () => ({ isAdminEmail: (email: string | undefined) => email?.toLowerCase() === "admin@example.com" }));
vi.mock("@/lib/env", () => ({ getAdminEmails: () => "admin@example.com" }));
vi.mock("@/lib/supabase/server", () => ({ createAuthClient }));

import { signIn } from "./auth";

function credentials(email: string, password = "password") {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return form;
}

describe("admin password sign-in", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a non-admin before calling Supabase", async () => {
    await expect(signIn({}, credentials("outsider@example.com"))).resolves.toEqual({ error: "Not authorised" });
    expect(createAuthClient).not.toHaveBeenCalled();
  });

  it("requires a password", async () => {
    await expect(signIn({}, credentials("admin@example.com", ""))).resolves.toEqual({ error: "Enter your password." });
    expect(createAuthClient).not.toHaveBeenCalled();
  });

  it("returns a generic error for invalid credentials", async () => {
    signInWithPassword.mockResolvedValue({ data: { user: null }, error: new Error("invalid") });
    await expect(signIn({}, credentials("ADMIN@example.com"))).resolves.toEqual({ error: "Email or password is incorrect." });
    expect(signInWithPassword).toHaveBeenCalledWith({ email: "admin@example.com", password: "password" });
  });

  it("signs out an unexpected non-admin identity", async () => {
    signInWithPassword.mockResolvedValue({ data: { user: { email: "outsider@example.com" } }, error: null });
    await expect(signIn({}, credentials("admin@example.com"))).resolves.toEqual({ error: "Not authorised" });
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("opens the dashboard for an authenticated admin", async () => {
    signInWithPassword.mockResolvedValue({ data: { user: { email: "admin@example.com" } }, error: null });
    await expect(signIn({}, credentials("admin@example.com"))).rejects.toThrow("REDIRECT:/");
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
