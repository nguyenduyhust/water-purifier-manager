# Integrations

**Last Updated**: 2026-10-17

One file per external system. For each: what it's used for, how it's configured, where the configuration lives (and whether it's secret), and what breaks if it's misconfigured.

| System | File | Used by |
|--------|------|---------|
| Firebase Authentication | [firebase-auth.md](firebase-auth.md) | Web, iOS |
| Cloud Firestore | [cloud-firestore.md](cloud-firestore.md) | Web, iOS, scripts |
| Google Sign-In | [google-sign-in.md](google-sign-in.md) | Web, iOS |
| Sign in with Apple | [sign-in-with-apple.md](sign-in-with-apple.md) | iOS |
| Vercel | [vercel.md](vercel.md) | Web hosting |
| App Store Connect / TestFlight | [app-store-connect.md](app-store-connect.md) | iOS distribution |
| Local notifications | [local-notifications.md](local-notifications.md) | iOS reminders |

## Configuration at a glance

| Item | Where | Committed? |
|------|-------|------------|
| Web Firebase config | `web/.env.local` (`VITE_FIREBASE_*`) | No |
| Emulator config | `web/.env.emulator` (demo values) | Yes |
| iOS Firebase config | `ios/WaterPurifierManager/GoogleService-Info.plist` | No |
| Google URL scheme | `ios/Config/Firebase.xcconfig` (`GOOGLE_REVERSED_CLIENT_ID`) | No (`.example` is) |
| Web app URL for iOS invite links | `ios/Config/App.xcconfig` (`WEB_APP_URL`) → `Info.plist` `WebAppURL` | Yes |
| Default Firebase project for the CLI | `firebase/.firebaserc` | Yes |

The Firebase web/iOS config values identify the project and are visible in every client; they are kept out of git by convention, not because they grant access. Access is controlled by the security rules.
