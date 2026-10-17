# Cloud Firestore

**Last Updated**: 2026-10-17

## Purpose

The only data store. Holds purifiers, filters, history and invites; enforces access through security rules.

## Configuration

| Item | Location |
|------|----------|
| Database | `(default)` in project `water-purifier-manager` |
| Rules | [`firebase/firestore.rules`](../../../firebase/firestore.rules) |
| Indexes | [`firebase/firestore.indexes.json`](../../../firebase/firestore.indexes.json) (exported from production, then extended) |
| Emulator | `firebase/firebase.json` — Firestore on 8080, UI on 4000 |

Rules and indexes are deployed with the Firebase CLI ([deployment](../../07-operations/deployment.md#firestore-rules-and-indexes)).

## Client usage

| Client | SDK | Cache |
|--------|-----|-------|
| Web | Firebase JS SDK 11 (`firebase/firestore`) | Default memory cache |
| iOS | FirebaseFirestore 12 | Default persistent cache (offline capable); memory cache in emulator mode |
| Scripts | REST API (`firestore.googleapis.com/v1`) with the CLI's OAuth token, or the emulator with `Bearer owner` | — |

## Limits that shaped the code

- Batches hold at most 500 writes; deletions are chunked at 450.
- One query can't combine "owned" and "shared", hence two listeners ([ADR-0009](../../09-decisions/0009-owner-and-shared-queries.md)).
- Rules must be provable from the query: e.g. a member listing filters works because the rule depends only on the parent purifier.
- Queries with new shapes need composite indexes; missing ones fail with an error linking to the console.

## Failure modes

| Symptom | Likely cause |
|---------|--------------|
| `permission-denied` on new features | Client released before the rules were deployed |
| Shared purifiers missing right after deploy | `memberIds` index still building |
| `failed-precondition` mentioning an index | Query shape without an index |

## Related

- Database specs → [`../database/`](../database/README.md)
- Access control → [`../../08-security/access-control.md`](../../08-security/access-control.md)
