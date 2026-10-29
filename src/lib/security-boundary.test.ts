import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("server authorization boundaries", () => {
  it.each(["src/app/(admin)/page.tsx", "src/app/(admin)/coaches/page.tsx", "src/app/(admin)/invite-codes/page.tsx"])("checks admin authorization in %s", (path) => {
    expect(read(path)).toContain("await requireAdmin()");
  });
  it.each(["src/app/actions/coaches.ts", "src/app/actions/invite-codes.ts"])("starts server-only and authorizes every privileged action in %s", (path) => {
    const source = read(path);
    expect(source.startsWith('import "server-only";')).toBe(true);
    expect([...source.matchAll(/await requireAdmin\(\)/g)]).toHaveLength([...source.matchAll(/export async function /g)].length);
  });
  it("refuses an unlisted email before password authentication", () => {
    const source = read("src/app/actions/auth.ts");
    expect(source.startsWith('import "server-only";')).toBe(true);
    expect(source).toContain("!isAdminEmail(email, getAdminEmails())");
    expect(source).toContain('error: "Not authorised"');
    expect(source).toContain("signInWithPassword({ email, password })");
    expect(source).not.toContain("signInWithOtp");
  });

  it("sends signed-in non-admin users to the not-authorised page", () => {
    const source = read("src/app/sign-in/page.tsx");
    expect(source).toContain('redirect(isAdminEmail(data.user.email, getAdminEmails()) ? "/" : "/not-authorised")');
  });
  it("keeps service-role access in a server-only module", () => {
    const source = read("src/lib/supabase/admin.ts");
    expect(source.startsWith('import "server-only";')).toBe(true);
    expect(source).toContain("getServiceRoleConfig");
    expect(source).not.toContain("NEXT_PUBLIC_");
  });
});
