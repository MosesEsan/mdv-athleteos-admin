import { disableInviteCode } from "@/app/actions/invite-codes";
import { InlineConfirmButton } from "@/components/inline-confirm-button";
import type { InviteCode } from "@/lib/types";

const formatter = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

function getStatus(code: InviteCode): "Active" | "Used up" | "Expired" {
  if (code.used_count >= code.max_uses) return "Used up";
  if (code.expires_at && new Date(code.expires_at) <= new Date()) return "Expired";
  return "Active";
}

export function InviteCodeTable({ codes }: { codes: InviteCode[] }) {
  if (codes.length === 0) return <div className="emptyState">No invite codes yet.</div>;
  return (
    <div className="tableWrap"><table>
      <thead><tr><th>Code</th><th>Note</th><th>Uses</th><th>Expires</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{codes.map((code) => {
        const status = getStatus(code);
        return <tr key={code.code}>
          <td><code>{code.code}</code></td><td>{code.note ?? ""}</td><td>{code.used_count} / {code.max_uses}</td>
          <td>{code.expires_at ? formatter.format(new Date(code.expires_at)) : "Never"}</td>
          <td>{formatter.format(new Date(code.created_at))}</td><td><span className={`status status${status.replace(" ", "")}`}>{status}</span></td>
          <td>{status === "Active" ? <InlineConfirmButton label="Disable" confirmLabel="Confirm disable" action={disableInviteCode.bind(null, code.code)} /> : null}</td>
        </tr>;
      })}</tbody>
    </table></div>
  );
}
