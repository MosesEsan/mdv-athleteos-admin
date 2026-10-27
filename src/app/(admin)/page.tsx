import { requireAdmin } from "@/lib/auth";
import { getOverview } from "@/lib/data";

export default async function OverviewPage() {
  await requireAdmin();
  const overview = await getOverview();
  return <><header className="pageHeader"><div><p className="eyebrow">Dashboard</p><h2>Overview</h2></div></header><section className="statsGrid">
    <article className="statCard"><span>Pending coaches</span><strong>{overview.pending}</strong></article>
    <article className="statCard"><span>Approved coaches</span><strong>{overview.approved}</strong></article>
    <article className="statCard"><span>Rejected coaches</span><strong>{overview.rejected}</strong></article>
    <article className="statCard"><span>Clients</span><strong>{overview.clients}</strong></article>
    <article className="statCard"><span>Sessions finished in 7 days</span><strong>{overview.sessions}</strong></article>
  </section></>;
}
