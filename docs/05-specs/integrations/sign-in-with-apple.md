# Sign in with Apple

**Last Updated**: 2026-10-17

## Purpose

Apple sign-in on iOS. Required by App Review because the app offers Google sign-in.

## Configuration

| Item | Value |
|------|-------|
| Entitlement | `com.apple.developer.applesignin = [Default]` in `ios/Config/WaterPurifierManager.entitlements` |
| App ID | `com.nguyenduyhust.waterpurifiermanager`, team `HH22B576H5`, capability "Sign in with Apple" (enabled automatically by Xcode signing) |
| Firebase | Apple provider enabled; no Services ID or key needed for native iOS (only for web) |

## Flow

1. `SignInWithAppleButton` requests `.fullName` and `.email` with `nonce = SHA256(random)` (`AppleSignInNonce`).
2. On success, `OAuthProvider.appleCredential(withIDToken:rawNonce:fullName:)` signs in to Firebase.
3. Apple shares the name only on the first sign-in; the app stores it as the Firebase display name.

## Notes

- Users who choose "Hide My Email" get a relay address that won't match email invites; they should use link invites.
- Works on device with a paid developer team; the simulator needs an Apple ID signed in.
- Not offered on the web.

## Related

- Firebase Auth → [firebase-auth.md](firebase-auth.md)
- App Store Connect → [app-store-connect.md](app-store-connect.md)
