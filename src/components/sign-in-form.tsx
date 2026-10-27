"use client";

import { useActionState } from "react";

import type { SignInState } from "@/app/actions/auth";

const initialState: SignInState = {};

export function SignInForm({ action: signInAction }: { action: (state: SignInState, formData: FormData) => Promise<SignInState> }) {
  const [state, action, pending] = useActionState(signInAction, initialState);

  return (
    <form action={action} className="formStack">
      <label htmlFor="email">Admin email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <button type="submit" disabled={pending}>
        {pending ? "Sending link..." : "Send magic link"}
      </button>
      {state.error ? <p className="error" role="alert">{state.error}</p> : null}
      {state.sent ? <p className="success" role="status">Check your email for the sign-in link.</p> : null}
    </form>
  );
}
