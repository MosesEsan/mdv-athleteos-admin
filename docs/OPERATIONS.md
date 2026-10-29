# AthleteOS Training Admin operations record

This record describes the admin deployment verified on 29 October 2026. It contains no secret values.

## Live setup

- Admin repository: [`MosesEsan/mdv-athleteos-admin`](https://github.com/MosesEsan/mdv-athleteos-admin)
- Admin Vercel project: `mdv-athleteos-training` under `mosesesans-projects`
- Stable admin alias: <https://mdv-athleteos-admin.vercel.app/athleteos/admin>
- Company site Vercel project: `mesan-digital-ventures`
- Company entry point: <https://mesandigitalventures.com/athleteos/admin>
- App base path: `/athleteos/admin`
- Company-site routing commit: `1b8c917` (`Route AthleteOS admin through company domain`)

The similarly named Vercel project `mdv-athleteos-admin` is empty. The admin app is currently hosted in `mdv-athleteos-training`. The stable alias is explicitly assigned to the current admin deployment, and the company-site `vercel.json` rewrites point to that alias. If the app moves projects, move the environment variables, update the alias or rewrite destination, and verify sign-in before switching traffic.

## Environment and sign-in

The active admin project has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAILS` configured for Production. The last two are server-only. Sign-in uses the admin user's Supabase Auth email and password. The signed-in email must be present in `ADMIN_EMAILS` to access protected pages or server actions. The dashboard does not create accounts. Allowlisted admins can request a password reset from the sign-in page.

Password sign-in does not use Auth callback URLs, but the password recovery link uses `/athleteos/admin/auth/recovery`. Add the callback URL for each active origin in Supabase Auth Redirect URLs; see the deployment guide. To operate the dashboard, open the company entry point and enter the credentials of an existing allowlisted Supabase Auth account. An allowlisted admin who forgot a password can use the recovery email and choose a new one. Open the recovery link in the browser that requested it.

## Verification

The password sign-in build passed `npm test` (16 tests), `npm run lint`, `npm run typecheck`, and `npm run build`. Searching `.next/static` found no `SUPABASE_SERVICE_ROLE_KEY` string. The staged production deployment served the password field, and the stable admin alias now points to it. The company URL displays the email and password form; a live browser attempt with a non-allowlisted email returned `Not authorised`. The company homepage content hash was unchanged by the earlier domain-routing deployment.

An end-to-end password sign-in from the company domain still needs a test with an existing allowlisted account. Sign in as an allowlisted operator and inspect Overview, Coaches, and Invite Codes. The unit tests cover allowlist checks and protected action behaviour; they do not verify the user's actual password.

## Recovery and design deployment on 29 October 2026

PR [#3](https://github.com/MosesEsan/mdv-athleteos-admin/pull/3) contains the password recovery flow and field service admin styling. Commits `d094b50` and `5308fd2` were deployed to the active `mdv-athleteos-training` Vercel project. The production deployment is `mdv-athleteos-training-4b38odi8k-mosesesans-projects.vercel.app`; `mdv-athleteos-admin.vercel.app` was reassigned to it, so the company-site rewrite serves this version.

The Supabase Auth Redirect URLs now include the four recovery callback origins listed in `docs/DEPLOYMENT.md`. The company URL displayed the updated password sign-in form and the forgot-password form after deployment. Local verification passed 21 unit tests, lint, typecheck, and build. The generated client bundle did not contain the `SUPABASE_SERVICE_ROLE_KEY` variable name. This local checkout did not have the key value, so a value comparison was unavailable.

An end-to-end recovery email and password change still requires the account owner. They should request a link from the company URL, open the email in the same browser, enter a new password, and sign in. This step cannot be completed by the deployment operator on their behalf.

## Coach password reset

The Coaches table has **Send reset link** for each coach. The server action checks the signed-in admin, confirms that the selected profile has role `coach`, then resolves that profile's Supabase Auth email. It requests a standard Supabase recovery email with `redirectTo=athleteostraining://auth/callback`. The mobile app already handles that link and shows its New password screen. This does not change the password in the admin dashboard or send a generated password.

Keep `athleteostraining://auth/callback` in the Athlete OS Training Supabase Auth Redirect URLs. A coach needs the mobile app installed and must open the email on that device. Supabase email limits still apply. Admins should only send a link after the coach requests help; they should not ask the coach to share the resulting password.

## Database ownership

The admin repository contains no migrations. Database schema, grants, functions, and database tests belong in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training).
