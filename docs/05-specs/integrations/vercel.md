# Vercel

**Last Updated**: 2026-10-17

## Purpose

Builds and hosts the web app. Production: https://water-purifier-manager.vercel.app. Every pull request gets a preview deployment, reported as a GitHub check.

## Configuration

| Setting | Value |
|---------|-------|
| Root Directory | `web` |
| Include files outside the root directory | **On** — the build imports `shared/purifier-types.json` |
| Build | `npm run build` (from `web/vercel.json`) |
| Output | `dist` |
| Rewrites | Every path except `/assets/*` → `/index.html` (SPA, deep links, invite links) |
| Environment variables | `VITE_FIREBASE_*` for the production Firebase project |
| Production branch | `main` |

## Failure modes

| Symptom | Likely cause |
|---------|--------------|
| Build can't find `package.json` | Root Directory not set to `web` |
| Build can't resolve `@shared/purifier-types.json` | "Include files outside the root directory" turned off |
| 404 on `/invite/…` or a refreshed deep link | Rewrites missing |
| App loads but Firebase errors | Environment variables missing or wrong |

## Related

- Deployment → [`../../07-operations/deployment.md`](../../07-operations/deployment.md)
