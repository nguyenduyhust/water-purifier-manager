# Authentication Requirements

**Version**: 1.2.0
**Last Updated**: 2026-10-17

## Overview

Users have one account across the web and iOS apps, managed by Firebase Authentication. Every screen except sign-in, sign-up, forgot-password, the privacy policy, support and the invite page requires a signed-in user; the invite page requires one too but first sends the visitor to sign in and then back.

## Data Model Summary

No user collection in Firestore. Identity comes from Firebase Auth: `uid`, `email`, `displayName`, `emailVerified`. A user's display name (or email) is copied into documents where other people need to see it: `purifiers.ownerName`, `purifiers.memberProfiles`, `invites.createdByName`, `logs.actorName`.

## Requirements

### FR-001: Authentication
- **Priority**: High
- **Status**: Done
- **Acceptance criteria**:
  - [x] Register with email, password (≥ 6 characters, Firebase default) and an optional name
  - [x] Sign in with email and password
  - [x] Sign in with Google — web: popup, or redirect inside embedded webviews (Zalo, Facebook, Instagram, LINE, WeChat) that block popups; iOS: native Google Sign-In
  - [x] Sign in with Apple — iOS only; the name Apple shares on first sign-in becomes the display name
  - [x] Reset password by email
  - [x] Stay signed in across browser restarts and app launches (Firebase persistence)
  - [x] Signed-out visitors to protected pages are sent to sign-in and returned to the page they wanted afterwards (web; needed for invite links)
  - [x] Sign out (web: avatar menu; iOS: Settings, with confirmation); iOS also cancels pending reminders on sign-out

### FR-010: Account deletion
- **Priority**: High (App Store Review Guideline 5.1.1(v))
- **Status**: Done
- **Acceptance criteria**:
  - [x] Delete the account from inside the app (web: avatar menu; iOS: Settings), after a warning that it cannot be undone
  - [x] The user re-authenticates first (Firebase only deletes recently signed-in accounts): password, Google, or Apple (iOS only; web points Apple accounts to the iOS app)
  - [x] Deletes the purifiers the user owns with their filters, history and invites; members of those purifiers lose access
  - [x] Removes the user from purifiers shared with them; history entries they added there stay, with their name, as part of the owner's history
  - [x] Deletes the user's remaining invites and legacy `activityLogs`, then the Firebase Auth account
  - [x] iOS revokes the Sign in with Apple token and cancels pending reminders
  - [x] Done on the client with the existing security rules (no Cloud Functions)
- **Privacy policy and support**: public pages at `/privacy` and `/support` on the web app, linked from the sign-in page and iOS Settings

## Platform differences

| Capability | Web | iOS |
|------------|-----|-----|
| Email/password | ✅ | ✅ |
| Google | ✅ | ✅ |
| Apple | — | ✅ |
| Delete account | Password or Google | Password, Google or Apple |
| Error messages | Mapped from Firebase error codes in the forms | `AuthErrorMessage` maps `AuthErrorCode`; cancelling Google/Apple shows nothing |

---

**Related**: [README](README.md) · [Sharing](sharing.md) (email invites require a verified email) · [Auth architecture](../../03-architecture/auth.md) · Screens: [web sign-in](../../05-specs/screens/web/sign-in.md), [iOS sign-in](../../05-specs/screens/ios/sign-in.md) · [Firebase Auth integration](../../05-specs/integrations/firebase-auth.md)
