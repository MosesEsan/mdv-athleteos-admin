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
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.error ? <p className="error" role="alert">{state.error}</p> : null}
    </form>
  );
}
