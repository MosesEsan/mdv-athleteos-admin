# AthleteOS Training Admin

A small, light-theme administration dashboard for AthleteOS Training. It lets authorised operators review coach applications, approve or reject coaches, manage coach invite codes, and monitor headline usage counts.

The app uses Supabase Auth magic links for sign-in. Every protected page and every server action performs a server-side allowlist check against `ADMIN_EMAILS`. Privileged database reads and mutations use the service-role key in server-only modules; the key is never exposed through a public environment variable.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the comma-separated `ADMIN_EMAILS` allowlist.
4. Add `http://localhost:3000` to Supabase **Auth > URL Configuration > Redirect URLs**.
5. Run `npm run dev` and open `http://localhost:3000`.

The app is configured with the `/athleteos` base path. Locally, open `http://localhost:3000/athleteos`.

Before pushing, run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

To check the generated browser bundle for server credentials:

```bash
rg -F 'SUPABASE_SERVICE_ROLE_KEY' .next/static
```

The command must return no matches. You can also search for the configured service-role value without printing it:

```bash
if rg -F --quiet "$SUPABASE_SERVICE_ROLE_KEY" .next/static; then echo 'secret found'; exit 1; else echo 'secret absent'; fi
```

## Vercel setup

1. Import `mesandigital/mdv-athleteos-admin` into Vercel.
2. In the project environment-variable settings, add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAILS`.
3. Add the Vercel deployment URL, `https://mesandigitalventures.com/athleteos`, and `http://localhost:3000/athleteos` to Supabase **Auth > URL Configuration > Redirect URLs**.
4. Deploy. No database migration step runs from this repository.

For the complete Vercel deployment and company-domain rewrite procedure, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Database ownership

All database schema changes, migrations, grants, functions, and database tests belong in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training). This repository intentionally contains no migrations. It calls the existing service-role-only `set_coach_status` and `create_coach_code` functions and reads the existing tables.
