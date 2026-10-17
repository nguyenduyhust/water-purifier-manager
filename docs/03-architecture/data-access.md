# Data Access

**Last Updated**: 2026-10-17

How the apps read and write Firestore. The patterns below exist identically in the web services and iOS repositories; the security rules are written to accept exactly these queries.

## Reading purifiers: two queries, merged

Owned and shared purifiers can't be fetched with one Firestore query, so each client runs two listeners and merges them, newest first:

```
purifiers where userId == uid                order by createdAt desc   (owned)
purifiers where memberIds array-contains uid order by createdAt desc   (shared)
```

Keeping the owner in `userId` (and out of `memberIds`) means existing purifiers needed no migration when sharing was added ([ADR-0009](../09-decisions/0009-owner-and-shared-queries.md)). If the shared query fails (e.g. its index is still building), owned purifiers still show.

## Filters

One listener per accessible purifier on `purifiers/{id}/filters` ordered by `position`, without a `userId` filter: access follows the parent purifier. The legacy owner query (`where userId == uid`) is still accepted by the rules for older builds.

## History

Fetched on demand, not streamed:

1. Up to 50 newest entries from each accessible purifier's `logs`.
2. Up to 50 from the legacy `activityLogs` where `userId == uid`.
3. De-duplicate by document id (migrated copies keep the legacy id; the per-purifier copy wins), sort by `timestamp`, keep 50.

## Writes

| Operation | Writes | Atomicity |
|-----------|--------|-----------|
| Create purifier | purifier + one doc per filter | One batch; then a `purifier_created` log |
| Edit purifier | `name`, `location`, `notes`, `updatedAt` | Single update |
| Replace filter | filter `lastReplacedAt`, `updatedAt` | Update, then a `filter_replaced` log (two writes) |
| Delete purifier | all filters, logs, the owner's invites for it, then the purifier | Batches of ≤ 450; purifier last so child rules still see it |
| Create invite | purifier `ownerName` if changed, then the invite | Two writes |
| Accept invite | purifier (`memberIds` ∪ me, `roles.me`, `memberProfiles.me`, `lastInviteId`) + invite (`accepted`) | One batch; each side's rule verifies the other |
| Change role / remove member / leave | purifier `roles`, `memberIds`, `memberProfiles` | Single update with field paths |

Optional activity-log fields are written as `null`, not omitted, on both platforms.

## Timestamps

Firestore `Timestamp` in storage. Web converts with `.toDate()`; iOS decodes into `Date` through `Codable`. Dates chosen by users (installation, replacement) are stored as entered; `createdAt`/`updatedAt` use the client clock (`Timestamp.now()`), except `acceptedAt`, which uses `serverTimestamp()`.

## Error handling

- Web listeners on single documents and filters treat permission errors as "no access" (purifier `null`, filters `[]`), which is what happens right after a member is removed.
- iOS decodes documents with `try?`, so one malformed document is skipped instead of breaking a list. Unknown roles decode as raw strings and grant no access.

## Indexes

| Collection | Fields | Used by |
|------------|--------|---------|
| `purifiers` | `userId` ↑, `createdAt` ↓ | owned purifiers |
| `purifiers` | `memberIds` array-contains, `createdAt` ↓ | shared purifiers |
| `activityLogs` | `userId` ↑, `timestamp` ↓ | legacy history |
| `filters` (collection group) | `userId` ↑, `position` ↑ | legacy filter query |

Defined in [`firebase/firestore.indexes.json`](../../firebase/firestore.indexes.json).

## Related

- Database specs → [`../05-specs/database/`](../05-specs/database/README.md)
- Rules → [`../08-security/access-control.md`](../08-security/access-control.md)
- Sequences → [diagrams/sequence.md](diagrams/sequence.md)
