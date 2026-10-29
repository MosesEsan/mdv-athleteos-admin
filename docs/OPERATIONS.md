# AthleteOS Training Admin operations record

This record describes the deployment as verified on 28 October 2026. It contains no secret values.

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

The active admin project has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAILS` configured for Production. The last two are server-only. Sign-in uses the admin user's Supabase Auth email and password. The signed-in email must be present in `ADMIN_EMAILS` to access protected pages or server actions. The dashboard does not create accounts or reset passwords.

Password sign-in does not use the previously configured Auth callback URLs. To operate the dashboard, open the company entry point and enter the credentials of an existing allowlisted Supabase Auth account. A Supabase project administrator must set a password for an existing admin user if that user only signed in through magic links before this change.

## Verification

The password sign-in build passed `npm test` (16 tests), `npm run lint`, `npm run typecheck`, and `npm run build`. Searching `.next/static` found no `SUPABASE_SERVICE_ROLE_KEY` string. The company URL routes to `/athleteos/admin/sign-in`; the company homepage content hash was unchanged by the earlier domain-routing deployment.

An end-to-end password sign-in from the company domain still needs a test with an existing allowlisted account. Sign in as an allowlisted operator and inspect Overview, Coaches, and Invite Codes. The unit tests cover allowlist checks and protected action behaviour; they do not verify the user's actual password.

## Database ownership

The admin repository contains no migrations. Database schema, grants, functions, and database tests belong in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training).
