import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  return <div className="appShell"><aside className="sidebar">
    <div><p className="eyebrow">AthleteOS</p><h1>Training Admin</h1></div>
    <nav aria-label="Main navigation"><Link href="/">Overview</Link><Link href="/coaches">Coaches</Link><Link href="/invite-codes">Invite codes</Link></nav>
    <div className="account"><span>{user.email}</span><form action={signOut}><button className="secondaryButton" type="submit">Sign out</button></form></div>
  </aside><main className="content">{children}</main></div>;
}
