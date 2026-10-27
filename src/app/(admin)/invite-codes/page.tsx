import { InviteCodeForm } from "@/components/invite-code-form";
import { InviteCodeTable } from "@/components/invite-code-table";
import { requireAdmin } from "@/lib/auth";
import { getInviteCodes } from "@/lib/data";

export default async function InviteCodesPage() {
  await requireAdmin();
  const codes = await getInviteCodes();
  return <><header className="pageHeader"><div><p className="eyebrow">Access</p><h2>Invite codes</h2></div></header><InviteCodeForm action={createInviteCode} /><section className="panel"><h2>All codes</h2><InviteCodeTable codes={codes} /></section></>;
}
import { createInviteCode } from "@/app/actions/invite-codes";
