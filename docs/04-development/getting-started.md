# Getting Started

**Last Updated**: 2026-10-17

How to run the apps locally. You can point them at the production Firebase project (real data) or at the local emulators (throwaway data, safe for trying sharing flows).

## Prerequisites

| Tool | Version | Needed for |
|------|---------|------------|
| Node.js | 18+ (22 used in development) | Web, Firebase scripts |
| npm | 9+ | Web, Firebase scripts |
| Java | 11+ | Firebase emulators (with the pinned firebase-tools 13) |
| Xcode | 26+ | iOS |
| Firebase CLI login | `npx firebase-tools login` | Deploying rules, migrations, reading indexes |

## Web

```bash
cd web
npm install
cp .env.example .env.local      # fill in the Firebase web config
npm run dev                     # http://localhost:5173
```

`.env.local` holds the six `VITE_FIREBASE_*` values from Firebase console › Project settings › Your apps (web). It is git-ignored.

## Web against the emulators

```bash
# terminal 1
cd firebase
npm install
npx firebase emulators:start --only auth,firestore --project demo-water-purifier

# terminal 2 — optional sample data
cd firebase
node scripts/seed-sharing.mjs

# terminal 3
cd web
npm run dev:emulator            # uses web/.env.emulator (demo project)
```

The seed script creates `alice@example.com` (owner of "Kitchen purifier"), `bob@` (editor), `carol@` (viewer) and `dave@` (with invite link `/invite/daveInviteLink000001`), all with password `secret123`, plus two legacy history entries. The Emulator UI is at http://127.0.0.1:4000. Emulator data disappears when the emulators stop; re-run the seed script to reset.

## iOS

See [`ios/README.md`](../../ios/README.md) for the full setup. In short:

1. Open `ios/WaterPurifierManager.xcodeproj` in Xcode (packages resolve on first open).
2. Put `GoogleService-Info.plist` (Firebase console › iOS app) in `ios/WaterPurifierManager/`.
3. Copy `ios/Config/Firebase.xcconfig.example` to `Firebase.xcconfig` and set `GOOGLE_REVERSED_CLIENT_ID`.
4. Run on a simulator. For a device, select your team; Sign in with Apple needs a paid developer account.

Without the plist the app opens a "Firebase is not configured" screen instead of crashing.

To run iOS against the emulators, add the launch arguments `-useFirebaseEmulators` (and optionally `-signOutOnLaunch`) to the scheme. Debug builds only.

## Firebase tooling

```bash
cd firebase
npm install
npm test                         # rules tests (starts the Firestore emulator itself)
```

Deploy rules with a current CLI, not the pinned one — see [deployment](../07-operations/deployment.md).

## Next steps

- Repository layout → [monorepo.md](monorepo.md)
- Conventions → [conventions.md](conventions.md)
- Tests → [`../06-testing/`](../06-testing/README.md)
