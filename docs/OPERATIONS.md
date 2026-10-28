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

The active admin project has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAILS` configured for Production. The last two are server-only. Sign-in uses Supabase magic links; there is no dashboard password. The signed-in email must be present in `ADMIN_EMAILS` to access protected pages or server actions.

Supabase Auth allows these new callbacks:

```text
https://mesandigitalventures.com/athleteos/admin/auth/callback
https://mdv-athleteos-admin.vercel.app/athleteos/admin/auth/callback
http://localhost:3000/athleteos/admin/auth/callback
```

The three older `/athleteos/auth/callback` entries remain. To operate the dashboard, open the company entry point, enter an allowlisted email, and follow the one-time link delivered by Supabase.

## Verification

The new admin build passed `npm test` (11 tests), `npm run lint`, `npm run typecheck`, and `npm run build`. Searching `.next/static` found no `SUPABASE_SERVICE_ROLE_KEY` string. The production company URL returns a redirect to `/athleteos/admin/sign-in`, which returns 200; its CSS asset returns 200. The company homepage content hash was unchanged by deployment. A live browser attempt with an email outside `ADMIN_EMAILS` returned `Not authorised`.

An end-to-end magic-link sign-in from the company domain still needs a mailbox test with an allowlisted address. Sign in as an allowlisted operator and inspect Overview, Coaches, and Invite Codes. The unit tests cover the allowlist and protected action behaviour, but cannot prove email delivery.

## Database ownership

The admin repository contains no migrations. Database schema, grants, functions, and database tests belong in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training).
