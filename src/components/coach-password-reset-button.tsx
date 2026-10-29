"use client";

import { useActionState } from "react";

import type { CoachPasswordResetState } from "@/app/actions/coach-password-reset";

const initialState: CoachPasswordResetState = {};

export function CoachPasswordResetButton({ action: resetAction }: { action: (state: CoachPasswordResetState) => Promise<CoachPasswordResetState> }) {
  const [state, action, pending] = useActionState(resetAction, initialState);
  return <form action={action} className="rowAction">
    <button className="secondaryButton" type="submit" disabled={pending || state.sent}>
      {pending ? "Sending..." : state.sent ? "Reset link sent" : "Send reset link"}
    </button>
    {state.error ? <span className="error rowError" role="alert">{state.error}</span> : null}
    {state.sent ? <span className="success rowError" role="status">Sent to coach email</span> : null}
  </form>;
}
