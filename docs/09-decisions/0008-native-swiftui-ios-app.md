# 0008. A native SwiftUI iOS app

**Status**: Accepted
**Date**: 2026-10-16
**Deciders**: Project owner

---

## Context

A mobile app was wanted, mainly for reminders. Options ranged from wrapping the web app to a fully native app.

## Decision

We build a native iOS app in Swift/SwiftUI (iOS 17+), using the Firebase iOS SDK against the same project and schema as the web app, and add Sign in with Apple.

## Alternatives considered

- **Capacitor** — reuses ~100% of the web code and is fastest, but feels less native.
- **React Native / Expo** — shares TypeScript logic, but the UI must be rewritten anyway (shadcn/Tailwind don't run there).
- **PWA** — least effort, but weak notifications on iOS and no App Store presence.

## Consequences

- **Positive**: best native experience; first-class local notifications and Apple sign-in.
- **Negative / cost**: domain logic and Firestore access are implemented twice (TypeScript and Swift) and must be kept in parity; Android would be a third implementation.
- **Committed to**: parity rules in [`ios/README.md`](../../ios/README.md); unit tests pinning shared behavior.
- **Reversal cost**: high; a cross-platform rewrite would replace the iOS app.

## References

- [`../03-architecture/ios.md`](../03-architecture/ios.md)
