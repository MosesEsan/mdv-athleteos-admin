import { setCoachStatus } from "@/app/actions/coaches";
import { InlineConfirmButton } from "@/components/inline-confirm-button";
import type { Coach, CoachStatus } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function CoachTable({ coaches, status }: { coaches: Coach[]; status: CoachStatus }) {
  if (coaches.length === 0) return <div className="emptyState">No {status} coaches.</div>;

  return (
    <div className="tableWrap">
      <table>
        <thead><tr><th>Name</th><th>Business</th><th>Email</th><th>Signed up</th><th>Active clients</th><th>Actions</th></tr></thead>
        <tbody>
          {coaches.map((coach) => (
            <tr key={coach.id}>
              <td>{coach.fullName}</td>
              <td>{coach.businessName ?? "Not provided"}</td>
              <td>{coach.email}</td>
              <td>{dateFormatter.format(new Date(coach.signedUpAt))}</td>
              <td>{coach.activeClients}</td>
              <td><div className="actions">
                {status !== "approved" ? (
                  <form action={setCoachStatus.bind(null, coach.email, "approved")}><button type="submit">Approve</button></form>
                ) : null}
                {status !== "rejected" ? (
                  <InlineConfirmButton
                    label="Reject"
                    confirmLabel="Confirm reject"
                    action={setCoachStatus.bind(null, coach.email, "rejected")}
                  />
                ) : null}
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
