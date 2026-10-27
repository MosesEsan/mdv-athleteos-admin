"use client";

import { useActionState, useState } from "react";

import type { CreateCodeState } from "@/app/actions/invite-codes";

const initialState: CreateCodeState = {};

export function InviteCodeForm({ action: createAction }: { action: (state: CreateCodeState, formData: FormData) => Promise<CreateCodeState> }) {
  const [state, action, pending] = useActionState(createAction, initialState);
  const [copied, setCopied] = useState(false);

  return (
    <section className="panel">
      <h2>Create invite code</h2>
      <form action={action} className="formGrid">
        <label>Note<input name="note" required /></label>
        <label>Max uses<input name="maxUses" type="number" min="1" step="1" defaultValue="1" required /></label>
        <label>Expires in days<input name="expiresInDays" type="number" min="1" step="1" defaultValue="7" placeholder="Never" /></label>
        <button type="submit" disabled={pending}>{pending ? "Creating..." : "Create code"}</button>
      </form>
      {state.error ? <p className="error" role="alert">{state.error}</p> : null}
      {state.code ? (
        <div className="newCode" role="status">
          <code>{state.code}</code>
          <button type="button" className="secondaryButton" onClick={async () => {
            await navigator.clipboard.writeText(state.code ?? "");
            setCopied(true);
          }}>{copied ? "Copied" : "Copy"}</button>
        </div>
      ) : null}
    </section>
  );
}
