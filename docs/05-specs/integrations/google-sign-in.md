# Google Sign-In

**Last Updated**: 2026-10-17

## Purpose

"Continue with Google" on both apps, resulting in a Firebase Auth user.

## Web

- `GoogleAuthProvider` with `signInWithPopup`.
- In embedded webviews that block popups (user agent contains `FBAN`, `FBAV`, `Instagram`, `Zalo`, `Line/`, `MicroMessenger`, `WebView`, `wv)`), `signInWithRedirect` is used and `getRedirectResult` runs on load. The return path survives the reload via `sessionStorage` ([web architecture](../../03-architecture/web.md#routing)).
- Requires the site's domain in Firebase Auth's Authorized domains.

## iOS

- GoogleSignIn-iOS 9 via Swift Package Manager.
- Client id from `FirebaseApp.app()?.options.clientID` (from `GoogleService-Info.plist`).
- The callback URL scheme is `REVERSED_CLIENT_ID`, injected into `Info.plist` from `Config/Firebase.xcconfig` (`GOOGLE_REVERSED_CLIENT_ID`; git-ignored). `App.xcconfig` sets a placeholder so the project builds without it.
- `.onOpenURL { GIDSignIn.sharedInstance.handle($0) }` completes the flow.
- The button uses Google's "G" logo (vector asset `GoogleLogo`).

## Failure modes

| Symptom | Likely cause |
|---------|--------------|
| iOS returns to the app but nothing happens | Wrong or missing `GOOGLE_REVERSED_CLIENT_ID` URL scheme |
| Web popup closes immediately in Zalo/Facebook | Expected; redirect flow is used there |
| Consent screen shows `project-<number>` | OAuth app name not configured |

## Related

- Firebase Auth → [firebase-auth.md](firebase-auth.md)
