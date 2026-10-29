import { signOut } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  return <div className="appShell"><aside className="sidebar">
    <div className="sidebarBrand"><span className="brandMark" aria-hidden="true">AO</span><span><strong>AthleteOS</strong><small>Training admin</small></span></div>
    <AdminNav />
    <div className="account"><span>{user.email}</span><form action={signOut}><button className="secondaryButton" type="submit">Sign out</button></form></div>
  </aside><main className="content">{children}</main></div>;
}
