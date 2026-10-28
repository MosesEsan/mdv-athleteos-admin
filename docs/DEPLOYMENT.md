# Deploying AthleteOS Training Admin

This app is a Next.js server-rendered application. It must run on Vercel (or another platform that supports Next.js server actions and route handlers); it cannot be deployed as a static export.

The app uses the `/athleteos` base path so it can be reached through the existing company domain:

```text
https://mesandigitalventures.com/athleteos
```

## 1. Prepare and verify the branch

From the admin repository:

```bash
git switch feat/admin-dashboard
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Confirm that the service-role key is not present in the browser bundle:

```bash
rg -F 'SUPABASE_SERVICE_ROLE_KEY' .next/static
```

This command must return no matches. Do not commit `.env.local` or any other `.env` file.

## 2. Create the Vercel project

### Vercel dashboard

1. Import `mesandigital/mdv-athleteos-admin` into Vercel.
2. Keep the framework preset as **Next.js** and leave the project root at the repository root.
3. Add the following variables in **Project Settings > Environment Variables** for Production, Preview, and Development as appropriate:

   ```text
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ADMIN_EMAILS
   ```

   `SUPABASE_SERVICE_ROLE_KEY` must be a server-only variable. Never rename it with a `NEXT_PUBLIC_` prefix.
4. Deploy the `feat/admin-dashboard` branch for the first preview. After the pull request is merged, promote the production deployment from `main`.

### Vercel CLI

```bash
vercel login
cd /path/to/mdv-athleteos-admin
vercel link
vercel --prod
```

When prompted, select the correct Vercel team and either create or link the `mdv-athleteos-admin` project. Set the same four variables in the Vercel dashboard or with `vercel env` before the production deployment.

The app's deployment URL will be something like:

```text
https://mdv-athleteos-admin.vercel.app
```

The `/athleteos` base path means the health check URL on that deployment is:

```text
https://mdv-athleteos-admin.vercel.app/athleteos
```

## 3. Configure Supabase Auth redirects

In **Supabase Dashboard > Authentication > URL Configuration > Redirect URLs**, add:

```text
https://mesandigitalventures.com/athleteos/auth/callback
https://<admin-deployment-domain>/athleteos/auth/callback
http://localhost:3000/athleteos/auth/callback
```

Keep the Site URL set to the canonical application URL used by the project. The sign-in action only sends magic links to an email in the server-only `ADMIN_EMAILS` allowlist.

## 4. Link the admin app to the company domain

Vercel custom domains attach to a host, not to a path. Because `mesandigitalventures.com` already serves the company site, keep that domain on the existing `mesan-digital-ventures` project and add a rewrite there.

In the existing company-site Vercel project, add this rewrite under **Project Settings > Routing** or in the `vercel.json` used by that project:

```json
{
  "rewrites": [
    {
      "source": "/athleteos/:path*",
      "destination": "https://<admin-deployment-domain>/athleteos/:path*"
    }
  ]
}
```

Replace `<admin-deployment-domain>` with the stable production domain for the admin project. Use a production alias or custom subdomain rather than a temporary preview URL so the company-site rewrite does not change after each deployment.

Important: test the rewrite in the actual Vercel project before switching traffic. Vercel can preserve the original `Host` header for a cross-project external rewrite, which may cause a redirect loop when the destination is another Vercel project. If that happens, keep the company-site deployment unchanged and use the admin project's stable URL (or a dedicated `admin.mesandigitalventures.com` host) until the two apps are served by a same-project proxy or edge function.

After deploying the company site rewrite, verify:

```bash
curl -I https://mesandigitalventures.com/athleteos
curl -I https://mesandigitalventures.com/athleteos/sign-in
```

The first request should no longer return Vercel `NOT_FOUND`. The sign-in page should load with the light admin UI. Static assets and navigation links should remain under `/athleteos`.

## 5. Verify authentication and privileged operations

Use an address that is not in `ADMIN_EMAILS` and confirm:

- The magic-link form returns `Not authorised` without sending a link.
- A signed-in non-admin is redirected to `/athleteos/not-authorised`.
- Direct requests to `/athleteos`, `/athleteos/coaches`, and `/athleteos/invite-codes` do not expose data.
- Direct server-action requests are rejected unless the session email is allowlisted.

Then sign in with an allowlisted address and verify the Coaches, Invite Codes, and Overview pages against the existing Supabase project.

## 6. Database ownership

This repository contains no migrations. Any new view, function, grant, or database test belongs in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training) and should be linked from the admin pull request.
