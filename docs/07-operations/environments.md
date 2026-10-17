# Environments

**Last Updated**: 2026-10-17

| Environment | Web | iOS | Firebase |
|-------------|-----|-----|----------|
| **Production** | https://water-purifier-manager.vercel.app (branch `main`) | TestFlight builds (Release) | Project `water-purifier-manager` |
| **Preview** | Vercel preview URL per pull request | — | Same production project ⚠️ |
| **Local** | `npm run dev` → http://localhost:5173 with `web/.env.local` | Xcode Debug build | Same production project ⚠️ |
| **Emulator** | `npm run dev:emulator` with `web/.env.emulator` | Debug build with `-useFirebaseEmulators` | Local emulators, demo project `demo-water-purifier` |

⚠️ There is only one real Firebase project. Previews and local runs read and write **production data**. Use the emulators to try anything destructive, and remember that previews run new client code against the *deployed* rules.

## Emulator ports

| Service | Port |
|---------|------|
| Auth | 9099 |
| Firestore | 8080 |
| Emulator UI | 4000 |
| Hub / logging / websocket | 4400, 4500, 9150 |

## Configuration per environment

| Variable / file | Production | Emulator |
|-----------------|------------|----------|
| Web | Vercel env vars `VITE_FIREBASE_*` | `web/.env.emulator` (`VITE_FIREBASE_EMULATORS=true`) |
| iOS | `GoogleService-Info.plist` | Same plist, project id overridden to `demo-water-purifier` at launch |
| Scripts | Firebase CLI login (`npx firebase-tools login`) | `--emulator` flag, `Bearer owner` |

## Related

- Getting started → [`../04-development/getting-started.md`](../04-development/getting-started.md)
- Deployment → [deployment.md](deployment.md)
