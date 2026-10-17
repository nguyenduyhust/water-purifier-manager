# Invites

**Collection**: `invites`
**Types**: `Invite` in `web/src/types/index.ts`, `ios/WaterPurifierManager/Models/Invite.swift`
**Last Updated**: 2026-10-17

## Description

An invitation to join one purifier with a role. The random Firestore document id is the secret in the invite link (`/invite/<id>`), so anyone signed in can read an invite whose id they know, but nobody can list invites they don't own or that weren't sent to their email ([ADR-0005](../../09-decisions/0005-client-side-invites.md)). Invites are single use and expire after 7 days.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `purifierId` | string | ✅ | Purifier to join |
| `purifierName` | string | ✅ | Shown on the invite page |
| `role` | string | ✅ | `editor` or `viewer` |
| `email` | string \| null | ✅ | Lowercase email for email invites; `null` for link invites |
| `status` | string | ✅ | `pending`, `accepted` or `declined` |
| `createdBy` | string | ✅ | Owner uid |
| `createdByName` | string | ✅ | Owner display name or email |
| `createdAt` | timestamp | ✅ | Creation time |
| `expiresAt` | timestamp | ✅ | `createdAt` + 7 days (rules allow at most 8) |
| `acceptedBy` | string | — | Uid that accepted |
| `acceptedAt` | timestamp | — | Server time of acceptance |

## Lifecycle

See the [state diagram](../../03-architecture/diagrams/state.md#invite-lifecycle). Revoking deletes the document; expiry is checked against `expiresAt`, not stored.

## Access

| Operation | Who | Notes |
|-----------|-----|-------|
| Get by id | Anyone signed in | The id is the secret |
| List | Creator | `createdBy == me` (+ `purifierId`, `status`) |
| List | Invitee | `email == my verified email` (+ `status == pending`) |
| Create | Purifier owner | Valid role, `pending`, expiry within 8 days, lowercase email, no `acceptedBy` |
| Update → accepted | Invitee | Usable invite, only `status`/`acceptedBy`/`acceptedAt`, and the same batch adds them to the purifier |
| Update → declined | Email invitee | Usable email invite, only `status` |
| Delete | Creator | Revoke, or when the purifier is deleted |

"Usable" = `pending`, not expired, and for email invites the caller's token email matches and is verified.

## Written by

`sharingService` (web) / `SharingRepository` (iOS): `createInvite`, `revokeInvite`, `acceptInvite`, `declineInvite`.

## Related

- Requirements → [FR-009](../../02-requirements/functional/sharing.md)
- Sequence → [invite and accept](../../03-architecture/diagrams/sequence.md#invite-and-accept)
