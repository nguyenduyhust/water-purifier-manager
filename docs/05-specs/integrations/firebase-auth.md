# Firebase Authentication

**Last Updated**: 2026-10-17

## Purpose

Identity for both apps. Firestore rules read `request.auth.uid`, and for email invites `request.auth.token.email` and `email_verified`.

## Configuration

| Setting | Value |
|---------|-------|
| Project | `water-purifier-manager` |
| Providers | Email/Password, Google, Apple |
| Apps | Web app (`water-purifier-manager-web-app`), iOS app (bundle `com.nguyenduyhust.waterpurifiermanager`) |
| Authorized domains | Must include the Vercel domain and `localhost` for web sign-in |
| OAuth consent screen | Its app name is what Google shows during sign-in; when unset Google shows `project-<number>` (Firebase console › Project settings › Public-facing name, or Google Auth Platform › Branding) |

## Client usage

- Web: `firebase/auth` — see `web/src/services/auth-service.ts`.
- iOS: `FirebaseAuth` — see `ios/WaterPurifierManager/Stores/AuthSession.swift`.
- Emulator: Auth emulator on `127.0.0.1:9099`; the scripts use `Bearer owner` against it.

## Admin access from scripts

`firebase/scripts/migrate-activity-logs.mjs` looks up display names with the Identity Toolkit `accounts:lookup` endpoint, authenticated as the Firebase CLI's logged-in account.

## Failure modes

| Symptom | Likely cause |
|---------|--------------|
| `auth/unauthorized-domain` on web Google sign-in | Domain missing from Authorized domains |
| Google sign-in shows `project-978…` | Consent screen app name not set |
| Apple sign-in fails | Apple provider disabled, or the build lacks the entitlement/team |
| Email invites never appear | User's email not verified (email/password accounts start unverified) |

## Related

- Architecture → [`../../03-architecture/auth.md`](../../03-architecture/auth.md)
- Google → [google-sign-in.md](google-sign-in.md) · Apple → [sign-in-with-apple.md](sign-in-with-apple.md)
