"use client";

import { useActionState } from "react";

import type { RecoveryState } from "@/app/actions/password-recovery";

const initialState: RecoveryState = {};

export function PasswordRecoveryForm({ action: requestAction }: { action: (state: RecoveryState, formData: FormData) => Promise<RecoveryState> }) {
  const [state, action, pending] = useActionState(requestAction, initialState);
  if (state.sent) return <p className="success" role="status">If an admin account exists for that address, a password reset link is on its way. Open it in this browser.</p>;

  return <form action={action} className="formStack">
    <label htmlFor="recovery-email">Admin email</label>
    <input id="recovery-email" name="email" type="email" autoComplete="email" required />
    <button type="submit" disabled={pending}>{pending ? "Sending link..." : "Send reset link"}</button>
    {state.error ? <p className="error" role="alert">{state.error}</p> : null}
  </form>;
}

export function NewPasswordForm({ action: saveAction }: { action: (state: RecoveryState, formData: FormData) => Promise<RecoveryState> }) {
  const [state, action, pending] = useActionState(saveAction, initialState);
  if (state.saved) return <p className="success" role="status">Password updated. Sign in with your new password.</p>;

  return <form action={action} className="formStack">
    <label htmlFor="new-password">New password</label>
    <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
    <label htmlFor="confirm-password">Confirm new password</label>
    <input id="confirm-password" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
    <button type="submit" disabled={pending}>{pending ? "Saving password..." : "Save new password"}</button>
    {state.error ? <p className="error" role="alert">{state.error}</p> : null}
  </form>;
}
