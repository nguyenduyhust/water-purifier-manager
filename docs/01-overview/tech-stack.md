# Tech Stack

**Last Updated**: 2026-10-17

What each part of the system is built with. Versions are the ones pinned in the repo at the time of writing; the lockfiles (`web/package-lock.json`, `ios/…/Package.resolved`) are authoritative.

## Web (`web/`)

| Concern | Choice |
|---------|--------|
| Language | TypeScript (strict mode) |
| UI | React 18, React Router 7 |
| Build | Vite 6 |
| Styling | Tailwind CSS 3, shadcn/ui (Radix primitives), Lucide icons |
| Forms | React Hook Form + Zod |
| Dates | date-fns 4 (with `vi` and `enUS` locales) |
| i18n | i18next + react-i18next + browser language detector |
| Backend SDK | Firebase JS SDK 11 (Auth, Firestore) |
| Lint | ESLint 9 with typescript-eslint, react-hooks |
| Hosting | Vercel (static build, SPA rewrites in `web/vercel.json`) |

## iOS (`ios/`)

| Concern | Choice |
|---------|--------|
| Language | Swift (Swift 5 language mode) |
| UI | SwiftUI, iOS 17+, iPhone only |
| State | Observation (`@Observable` stores) |
| Backend SDK | Firebase iOS SDK 12 (FirebaseAuth, FirebaseFirestore) via Swift Package Manager |
| Sign-in | GoogleSignIn-iOS 9, AuthenticationServices (Sign in with Apple) |
| Reminders | UserNotifications (local notifications) |
| Localization | String Catalogs (`Localizable.xcstrings`, `InfoPlist.xcstrings`) — English, Vietnamese |
| Tests | Swift Testing (unit), XCTest (UI) |
| Distribution | App Store Connect / TestFlight |

## Backend (`firebase/`)

| Concern | Choice |
|---------|--------|
| Identity | Firebase Authentication — email/password, Google, Apple |
| Database | Cloud Firestore (single `(default)` database) |
| Access control | Firestore security rules (`firebase/firestore.rules`) |
| Local development | Firebase Emulator Suite (Auth, Firestore) |
| Rules tests | `@firebase/rules-unit-testing` 4 + Vitest, run with firebase-tools 13 |
| Scripts | Node.js ESM scripts in `firebase/scripts/` (seed data, data migrations) |

firebase-tools 13 is pinned only because the emulator needs Java 21 from version 14 onward and the development machine has Java 11. Deploy with a current firebase-tools — see [deployment](../07-operations/deployment.md).

## Shared

| Concern | Choice |
|---------|--------|
| Purifier catalog | JSON (`shared/purifier-types.json`) bundled into both apps |
| Repository | Single Git repo, one folder per platform ([ADR-0002](../09-decisions/0002-monorepo-by-platform.md)) |

## Related

- System map → [architecture.md](architecture.md)
- External services → [`../05-specs/integrations/`](../05-specs/integrations/README.md)
