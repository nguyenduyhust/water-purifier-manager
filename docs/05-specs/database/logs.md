# Logs (history)

**Collection**: `purifiers/{purifierId}/logs`
**Types**: `ActivityLog` in `web/src/types/index.ts`, `ios/WaterPurifierManager/Models/ActivityLog.swift`
**Last Updated**: 2026-10-17

## Description

The history of a purifier: when it was created and every filter replacement, with who did it. Stored under the purifier so every member can read it ([ADR-0006](../../09-decisions/0006-history-under-each-purifier.md)). Entries written before sharing existed were copied here from [`activityLogs`](activity-logs.md) by a migration; those copies keep the original document id and carry `migratedFrom`.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | `purifier_created` or `filter_replaced` |
| `timestamp` | timestamp | ✅ | When it happened (installation date, or the replacement date the user chose) |
| `purifierId` | string | ✅ | Parent purifier |
| `purifierName` | string | ✅ | Purifier name at the time |
| `filterId` | string \| null | ✅ | Replaced filter, `null` for `purifier_created` |
| `filterName` | string \| null | ✅ | Filter name at the time |
| `filterPosition` | number \| null | ✅ | Filter position |
| `notes` | string \| null | ✅ | Optional notes, trimmed; `null` when empty |
| `actorId` | string | ✅ | Uid of the user who did it |
| `actorName` | string | ✅ | Their display name or email at the time |
| `createdAt` | timestamp | ✅ | When the entry was written |
| `migratedFrom` | string | — | `activityLogs/<id>` on migrated copies only |

Optional fields are written as `null`, not omitted.

## Access

| Operation | Who | Notes |
|-----------|-----|-------|
| Read | Owner, members | Query: newest 50 by `timestamp` |
| Create | Owner, editors | `actorId` must be the writer; `type` one of the two values |
| Update | Nobody | History is append-only |
| Delete | Owner | When deleting the purifier |

## Written by

- `activityLogService.add` / `ActivityLogRepository.add`, called after creating a purifier and after replacing a filter
- `firebase/scripts/migrate-activity-logs.mjs` (migrated copies, admin credentials)

## Related

- Requirements → [FR-004](../../02-requirements/functional/filters.md), [FR-009](../../02-requirements/functional/sharing.md)
- Migration runbook → [`../../07-operations/data-migrations.md`](../../07-operations/data-migrations.md)
