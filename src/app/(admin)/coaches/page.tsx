import Link from "next/link";
import { CoachTable } from "@/components/coach-table";
import { requireAdmin } from "@/lib/auth";
import { getCoaches } from "@/lib/data";
import type { CoachStatus } from "@/lib/types";

const statuses: CoachStatus[] = ["pending", "approved", "rejected"];

export default async function CoachesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const requested = (await searchParams).status;
  const status: CoachStatus = statuses.includes(requested as CoachStatus) ? requested as CoachStatus : "pending";
  const coaches = await getCoaches(status);
  return <><header className="pageHeader"><div><p className="eyebrow">Accounts</p><h2>Coaches</h2></div></header>
    <nav className="tabs" aria-label="Coach status">{statuses.map((item) => <Link key={item} className={item === status ? "activeTab" : ""} href={`/coaches?status=${item}`}>{item[0].toUpperCase() + item.slice(1)}</Link>)}</nav>
    <CoachTable coaches={coaches} status={status} /></>;
}
