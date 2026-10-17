# Database (Cloud Firestore)

**Last Updated**: 2026-10-17

All user data lives in the `(default)` Firestore database of the Firebase project `water-purifier-manager`. There is no users collection — identity is Firebase Auth — and no purifier-types collection — the catalog is bundled ([purifier-types.md](../purifier-types.md)).

## Collections

| Collection | File | Purpose |
|------------|------|---------|
| `purifiers` | [purifiers.md](purifiers.md) | Purifiers, their owner and shared members |
| `purifiers/{id}/filters` | [filters.md](filters.md) | One document per filter cartridge |
| `purifiers/{id}/logs` | [logs.md](logs.md) | History, visible to every member |
| `invites` | [invites.md](invites.md) | Sharing invites |
| `activityLogs` | [activity-logs.md](activity-logs.md) | Legacy history (read-only, owner only) |

## Indexes

Defined in [`firebase/firestore.indexes.json`](../../../firebase/firestore.indexes.json) and deployed with `firebase deploy --only firestore`.

| Collection | Fields | Scope |
|------------|--------|-------|
| `purifiers` | `userId` ↑, `createdAt` ↓ | Collection |
| `purifiers` | `memberIds` array-contains, `createdAt` ↓ | Collection |
| `activityLogs` | `userId` ↑, `timestamp` ↓ | Collection |
| `filters` | `userId` ↑, `position` ↑ | Collection group |

Single-field indexes (e.g. `logs` by `timestamp`, `invites` equality filters) are automatic.

## Conventions

- Field names are identical on web and iOS.
- Dates are `Timestamp`.
- `userId` on purifiers and filters is always the **owner**, never a member.
- Display names are denormalized where other users need them (`ownerName`, `memberProfiles`, `createdByName`, `actorName`).

## Related

- ER diagram → [`../../03-architecture/diagrams/er.md`](../../03-architecture/diagrams/er.md)
- Access rules → [`../../08-security/access-control.md`](../../08-security/access-control.md)
- Data access patterns → [`../../03-architecture/data-access.md`](../../03-architecture/data-access.md)
