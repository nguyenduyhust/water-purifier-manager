# Monitoring

**Last Updated**: 2026-10-17

## What exists

| Signal | Where |
|--------|-------|
| Firestore usage (reads, writes, deletes), rules evaluations and denials | Firebase console › Firestore › Usage; Google Cloud monitoring |
| Auth sign-ins and users | Firebase console › Authentication |
| Web build and deploy status | Vercel dashboard; GitHub checks on PRs |
| iOS builds, testers, crash feedback | App Store Connect › TestFlight |
| Client errors | Browser console / Xcode console only (`console.error`, alerts) |

## What doesn't

- No crash reporting (Firebase Crashlytics is not integrated).
- No web error tracking or analytics.
- No alerting on quota, cost or error spikes.

## Recommended

1. Budget alert on the Google Cloud billing account (if moving to Blaze).
2. Firebase Crashlytics for iOS.
3. A lightweight error tracker for the web, or at least Firestore rules-denial monitoring after each rules deploy.

## Related

- Non-functional targets → [`../02-requirements/non-functional.md`](../02-requirements/non-functional.md)
