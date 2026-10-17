# Activity Logs (legacy)

**Collection**: `activityLogs`
**Status**: Legacy — read-only for current clients
**Last Updated**: 2026-10-17

## Description

The original, top-level history collection written before sharing existed. Each entry belongs to one user (`userId`), so members of a shared purifier can't read it. On 2026-10-17 all 11 production entries were copied into [`purifiers/{id}/logs`](logs.md) with the same ids ([data migrations](../../07-operations/data-migrations.md)); the originals were left in place.

Current web and iOS clients still read this collection for the signed-in user and de-duplicate by id, because app versions released before sharing (the previous web deploy, iOS build 2) keep writing here until users update. Retiring it is [proposal 0003](../../10-proposals/0003-retire-legacy-activity-logs.md).

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Owner uid |
| `type` | string | `purifier_created` or `filter_replaced` |
| `timestamp` | timestamp | When it happened |
| `purifierId` | string | Purifier |
| `purifierName` | string | Purifier name at the time |
| `filterId`, `filterName`, `filterPosition` | string/number \| null | Filter details for replacements |
| `notes` | string \| null | Notes |
| `createdAt` | timestamp | When written |

## Access

Read, create, update and delete only by the user in `userId`. Current clients only read.

## Related

- Replacement → [logs.md](logs.md)
- ADR → [ADR-0006](../../09-decisions/0006-history-under-each-purifier.md)
