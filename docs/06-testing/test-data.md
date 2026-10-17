# Test Data

**Last Updated**: 2026-10-17

## Emulator seed

`firebase/scripts/seed-sharing.mjs` wipes the emulators (Auth accounts and Firestore) for the demo project `demo-water-purifier` and creates:

| Account (password `secret123`) | Role |
|-------------------------------|------|
| `alice@example.com` (Alice) | Owner of "Kitchen purifier" (`purifiers/kitchen`) |
| `bob@example.com` (Bob) | Editor |
| `carol@example.com` (Carol) | Viewer |
| `dave@example.com` (Dave) | Not a member; can join with invite `daveInviteLink000001` (viewer, link invite) |

Plus:
- Two filters (`f1` due in ~11 days, `f2` OK), installed 80 days ago.
- One `purifier_created` log by Alice.
- Two legacy `activityLogs` entries for Alice (`legacyCreated`, `legacyReplaced`) to exercise the history migration.

```bash
cd firebase && node scripts/seed-sharing.mjs     # emulators must be running
```

Email/password accounts start unverified. To test email invites, mark the user verified in the Emulator UI (http://127.0.0.1:4000/auth) or sign in with Google in the emulator, then reload the app.

## Rules test fixture

Defined inline in `firebase/tests/firestore.rules.test.ts` (`alice`, `bob`, `carol`, `dave`, `erin`); reset before every test with `clearFirestore()`.

## Production

Never use production data for testing. If a manual check on production is needed (e.g. after a release), use your own accounts and clean up invites you create.

## Related

- Rules tests → [rules.md](rules.md) · iOS tests → [ios.md](ios.md)
