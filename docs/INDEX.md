# AthleteOS Training documentation

Start here for the admin dashboard, mobile app, deployment, and operator procedures. Database migrations and tests belong to the [mobile app repository](https://github.com/mesandigital/mdv-athleteos-training).

## Admin dashboard

| Guide | Covers |
| --- | --- |
| [Admin README](../README.md) | What the dashboard does, local setup, required environment variables, and checks before pushing. |
| [Admin deployment](DEPLOYMENT.md) | Vercel setup, Supabase Auth redirects, company-domain routing, and deployment verification. |
| [Admin operations](OPERATIONS.md) | Current deployment, operator checks, coach approval and invite codes, and sending a coach password reset link. |

The admin entry point is [mesandigitalventures.com/athleteos/admin](https://mesandigitalventures.com/athleteos/admin). Admin code and deployment changes are tracked in the [admin repository](https://github.com/MosesEsan/mdv-athleteos-admin).

## Mobile app and website

| Guide | Covers |
| --- | --- |
| [Push notifications](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/push-notifications.md) | Push setup, delivery, and verification. |
| [Deep links](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/deep-links.md) | App link routing, including the password recovery callback used by coach reset emails. |
| [Website deployment](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/website-deployment.md) | AthleteOS website and admin deployment notes. |
| [Store release guide](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/store-release-guide.md) | App Store and Google Play release procedure. |
| [Store listing](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/store-listing.md) | Store listing content and rollout notes. |
| [How it works](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/how-it-works.md) | Product flows and roles. |
| [Modules](https://github.com/mesandigital/mdv-athleteos-training/blob/main/docs/modules.md) | Shared `mdv-*` modules used by the app. |

The [mobile app documentation directory](https://github.com/mesandigital/mdv-athleteos-training/tree/main/docs) contains these guides and the design reference. Consult it for any guides added after this index was updated.
