# Deploying AthleteOS Training Admin

The live entry point is <https://mesandigitalventures.com/athleteos/admin>. This Next.js app has `basePath: "/athleteos/admin"` and runs on Vercel. The company-site Vercel project forwards that path to the admin deployment.

## 1. Build and verify the admin app

In the admin repository:

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
rg -F 'SUPABASE_SERVICE_ROLE_KEY' .next/static
```

The last command must return no matches. Keep `.env.local` and all real environment files out of Git.

## 2. Deploy the admin app

The active app is deployed in the `mdv-athleteos-training` Vercel project under the `mosesesans-projects` team. Its public stable alias is <https://mdv-athleteos-admin.vercel.app/athleteos/admin>. The separate Vercel project named `mdv-athleteos-admin` is currently empty; do not deploy there without first moving the four environment variables and updating the company-site rewrite destination.

The active project needs these Production environment variable names:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAILS
```

`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_EMAILS` stay server-only. Never add a `NEXT_PUBLIC_` prefix or commit their values.

Import [`MosesEsan/mdv-athleteos-admin`](https://github.com/MosesEsan/mdv-athleteos-admin) as a Next.js project if creating a new Vercel deployment. Set the four variables in **Project Settings > Environment Variables**. If continuing with the active project, link the checkout to `mdv-athleteos-training` and deploy there. Keep the stable `mdv-athleteos-admin.vercel.app` alias on the new admin deployment before routing the company site to it.

## 3. Configure Supabase Auth

In the Athlete OS Training Supabase project, open **Authentication > URL Configuration > Redirect URLs**. Allow these exact callbacks:

```text
https://mesandigitalventures.com/athleteos/admin/auth/callback
https://mdv-athleteos-admin.vercel.app/athleteos/admin/auth/callback
http://localhost:3000/athleteos/admin/auth/callback
```

These were added on 28 October 2026. The previous `/athleteos/auth/callback` entries remain for older deployments. Magic links use the request origin, so sign in from the domain where you intend to continue.

## 4. Route the company domain

The domain belongs to the `mesan-digital-ventures` Vercel project. Its source repository contains `vercel.json` with `outputDirectory: "dist"` and two rewrites:

```json
{
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/athleteos/admin",
      "destination": "https://mdv-athleteos-admin.vercel.app/athleteos/admin"
    },
    {
      "source": "/athleteos/admin/:path*",
      "destination": "https://mdv-athleteos-admin.vercel.app/athleteos/admin/:path*"
    }
  ]
}
```

Deploy the company-site project after the admin app is ready. If Vercel does not move the custom-domain aliases automatically, assign both `mesandigitalventures.com` and `www.mesandigitalventures.com` to the new company-site deployment. Keep the company site's existing `dist` content when redeploying.

## 5. Verify the route and access controls

```bash
curl -I -L https://mesandigitalventures.com/athleteos/admin
curl -I https://mesandigitalventures.com/athleteos/admin/sign-in
```

The first URL should redirect to the sign-in page, which should return 200. Verify an admin CSS asset loads under `/athleteos/admin/_next/static/`. Check that the homepage still renders and that a non-allowlisted email gets `Not authorised` without a magic link. Protected pages and server actions must reject unauthorised sessions. Then complete a magic-link sign-in with an allowlisted email and check Overview, Coaches, and Invite Codes.

## Database ownership

This repository contains no migrations. New views, functions, grants, and database tests belong in [`mesandigital/mdv-athleteos-training`](https://github.com/mesandigital/mdv-athleteos-training).
