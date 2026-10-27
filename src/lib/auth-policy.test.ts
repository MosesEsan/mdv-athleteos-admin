import { describe, expect, it } from "vitest";

import { isAdminEmail, parseAdminEmails } from "./auth-policy";

describe("admin email policy", () => {
  it("normalises configured addresses", () => {
    expect(parseAdminEmails(" Admin@Example.com, second@example.com ")).toEqual(new Set(["admin@example.com", "second@example.com"]));
  });
  it("refuses missing and non-allowlisted identities", () => {
    expect(isAdminEmail(undefined, "admin@example.com")).toBe(false);
    expect(isAdminEmail("outsider@example.com", "admin@example.com")).toBe(false);
  });
  it("accepts allowlisted identities case-insensitively", () => {
    expect(isAdminEmail("ADMIN@example.com", "admin@example.com")).toBe(true);
  });
});
