# AthleteOS Training Admin operations record

This page records the setup that has been completed and the remaining domain-linking limitation. It is safe to keep in the repository: it contains no credentials or secret values.

## Current deployment

- Repository: `MosesEsan/mdv-athleteos-admin`
- Production Vercel project: `mdv-athleteos-admin`
- Live admin URL: <https://mdv-athleteos-admin.vercel.app/athleteos>
- Base path: `/athleteos`
- Pull request: [#1](https://github.com/MosesEsan/mdv-athleteos-admin/pull/1), merged into `main`
- Deployment source: `main` after the admin-dashboard pull request was merged

The Vercel project has these production environment variable names configured:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAILS
```

The service-role variable is server-only. No value belongs in this document, in Git, or in a `NEXT_PUBLIC_` variable.

## Authentication configuration

Sign-in uses Supabase Auth magic links. The server checks the signed-in email against the comma-separated `ADMIN_EMAILS` allowlist on every protected page and server action. There is no dashboard password to document.

The Supabase Auth redirect allowlist currently contains:

```text
https://mesandigitalventures.com/athleteos/auth/callback
https://mdv-athleteos-admin.vercel.app/athleteos/auth/callback
http://localhost:3000/athleteos/auth/callback
```

For an operator test, open the live admin URL, enter an allowlisted email, and use the one-time link delivered by Supabase. An email outside `ADMIN_EMAILS` must receive `Not authorised` and must not receive a sign-in link.

## Verification completed

The following checks were run before deployment:

```bash
npm test
npm run lint
npm run typecheck
npm run build
rg -F 'SUPABASE_SERVICE_ROLE_KEY' .next/static
```

The build, lint, typecheck, and tests passed. The browser-bundle search returned no matches for `SUPABASE_SERVICE_ROLE_KEY`; the service-role value was not committed or shipped to client code.

## Custom domain status

`https://mesandigitalventures.com` remains attached to the existing company-site Vercel project. A cross-project rewrite from `/athleteos` to the admin project was tested, but Vercel preserved the original host and produced a redirect loop. That deployment was rolled back.

Therefore the supported live entry point is currently:

<https://mdv-athleteos-admin.vercel.app/athleteos>

Do not re-add the cross-project rewrite without testing it in a preview deployment. To serve the admin at the company domain, use a dedicated host such as `admin.mesandigitalventures.com`, or implement a same-project proxy/edge function that forwards the request without preserving the company-site host.

## Database ownership

The admin repository contains no migrations. Database schema, grants, functions, and database tests remain owned by [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training).
