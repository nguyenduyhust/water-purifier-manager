# Repository Layout

**Last Updated**: 2026-10-17

One Git repository, one folder per platform ([ADR-0002](../09-decisions/0002-monorepo-by-platform.md)). The platforms share no build tooling; they share data (`shared/`), the backend definition (`firebase/`) and the docs.

```
water-purifier-manager/
├── web/                 React + Vite web app (own package.json, deployed by Vercel with Root Directory = web)
│   ├── src/             pages, components, hooks, services, i18n, types
│   ├── public/          favicon.svg, apple-touch-icon.png
│   ├── .env.example     template for .env.local (git-ignored)
│   ├── .env.emulator    demo-project config for npm run dev:emulator
│   └── vercel.json      build command, output dir, SPA rewrites
├── ios/                 SwiftUI app
│   ├── WaterPurifierManager/            app sources (synchronized folder)
│   ├── WaterPurifierManagerTests/       unit tests (Swift Testing)
│   ├── WaterPurifierManagerUITests/     UI tests against the emulators
│   ├── Config/          Info.plist, entitlements, App.xcconfig (+ Firebase.xcconfig, git-ignored)
│   └── README.md        iOS setup and parity rules
├── shared/
│   ├── purifier-types.json   purifier catalog used by both apps
│   └── README.md             catalog format, how to add a model
├── firebase/
│   ├── firestore.rules            security rules (deployed)
│   ├── firestore.indexes.json     composite indexes (deployed)
│   ├── firebase.json, .firebaserc emulator ports, default project
│   ├── tests/                     rules tests (Vitest + rules-unit-testing)
│   └── scripts/                   seed-sharing.mjs, migrate-activity-logs.mjs
├── docs/                this documentation
├── CLAUDE.md            conventions and commands for humans and AI assistants
└── README.md            project readme
```

## Cross-folder dependencies

| From | Uses | How |
|------|------|-----|
| `web/` | `shared/purifier-types.json` | `@shared` Vite/TS alias; Vercel must include files outside the root directory |
| `ios/` | `shared/purifier-types.json` | File reference in the Xcode project, copied into the app bundle |
| `web/`, `ios/` | `firebase/firestore.rules` | Must be deployed before clients that rely on new rules |
| `ios/` UI tests | `firebase/scripts/seed-sharing.mjs` | Seed the emulators before running |

## What is git-ignored

`node_modules/`, `dist/`, `.env*.local`, `GoogleService-Info.plist` (anywhere), `ios/Config/Firebase.xcconfig`, Xcode user data, Firebase debug logs. See [data protection](../08-security/data-protection.md).

## Related

- Getting started → [getting-started.md](getting-started.md)
- Workflow → [workflow.md](workflow.md)
