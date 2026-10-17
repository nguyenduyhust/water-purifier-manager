# Access Control

**Last Updated**: 2026-10-17

Authorization is implemented entirely in [`firebase/firestore.rules`](../../firebase/firestore.rules). This page explains it; the file is authoritative.

## Helpers

| Function | Meaning (for purifier data `d`) |
|----------|---------------------------------|
| `isOwner(d)` | `d.userId == request.auth.uid` |
| `isMember(d)` | caller's uid is in `d.memberIds` |
| `canRead(d)` | owner or member |
| `canEdit(d)` | owner, or member whose `d.roles[uid] == 'editor'` |
| `validMembership(d)` | ≤ 20 members; owner not in `memberIds`; `roles` keys = `memberIds`; roles only `editor`/`viewer`; `memberProfiles` keys ⊆ `memberIds` |
| `inviteUsable(i)` | `pending`, `expiresAt` in the future, and if `i.email` is set: token email (lowercased) equals it and `email_verified` is true |

## `purifiers/{purifierId}`

| Operation | Allowed when |
|-----------|--------------|
| read | `userId == uid` **or** `uid in memberIds` (both are provable from the two client queries) |
| create | `userId == uid` and no `memberIds`/`roles`/`memberProfiles` |
| update | one of: |
| · owner update | caller owns it, `userId` unchanged, `validMembership(after)` |
| · editor update | caller is an editor (not owner) and only `name`, `location`, `notes`, `updatedAt` change |
| · leave | caller is a member and the only change is removing themselves from `memberIds`, `roles`, `memberProfiles` |
| · accept invite | caller is neither owner nor member; only `memberIds`, `roles`, `memberProfiles`, `lastInviteId` change; `memberIds` gains exactly the caller; `roles[caller]` equals the invite's role; `validMembership(after)`; the invite (read *before* the batch via `get`) is for this purifier and usable; the invite *after* the batch (`getAfter`) is `accepted` by the caller |
| delete | owner |

## `purifiers/{purifierId}/filters/{filterId}`

| Operation | Allowed when |
|-----------|--------------|
| read | `canRead(parent)` — independent of the filter document, so any query on the subcollection works for members |
| create | owner of the parent as it will be after the batch (`getAfter`), `userId == uid`, `purifierId` matches |
| update | `canEdit(parent)` and only `lastReplacedAt`, `intervalMonths`, `updatedAt` change |
| delete | owner of the parent |

## `purifiers/{purifierId}/logs/{logId}`

| Operation | Allowed when |
|-----------|--------------|
| read | `canRead(parent)` |
| create | `canEdit(parent after batch)`, `actorId == uid`, `type` in `purifier_created`, `filter_replaced` |
| update | never |
| delete | owner of the parent |

## `invites/{inviteId}`

| Operation | Allowed when |
|-----------|--------------|
| get | signed in (the id is the secret) |
| list | `createdBy == uid`, or `email == token email (lowercased)` |
| create | `createdBy == uid`, caller owns the purifier, role `editor`/`viewer`, `pending`, `expiresAt` within (now, now + 8 days), email `null` or lowercase string, no `acceptedBy` |
| update (accept) | `inviteUsable`, only `status`/`acceptedBy`/`acceptedAt` change, `accepted` by the caller, and the caller is in the purifier's `memberIds` after the batch |
| update (decline) | `inviteUsable`, email invite, only `status` → `declined` |
| delete | creator |

## `activityLogs/{logId}` (legacy)

Read and write only by the user in `userId`.

## Design notes

- **Mutual verification**: neither half of the accept batch is allowed alone — the purifier update needs the invite to become accepted, and the invite update needs the caller to be a member afterwards.
- **Owner outside `memberIds`** keeps old purifiers valid without migration and keeps the owner from being "removed".
- **Rules filter queries, not results**: every client query was shaped so its rule is provable (e.g. invites are listed with `createdBy == uid`).
- `get()`/`getAfter()` calls count toward Firestore's per-request limit and are billed as reads.

## Related

- Tests → [`../06-testing/rules.md`](../06-testing/rules.md)
- Sharing requirement → [`../02-requirements/functional/sharing.md`](../02-requirements/functional/sharing.md)
