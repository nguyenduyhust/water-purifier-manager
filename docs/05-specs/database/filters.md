# Filters

**Collection**: `purifiers/{purifierId}/filters`
**Types**: `Filter` in `web/src/types/index.ts`, `ios/WaterPurifierManager/Models/Purifier.swift`
**Last Updated**: 2026-10-17

## Description

One document per filter cartridge of a purifier, created from the model's templates in the same batch as the purifier. Status and next replacement date are computed on the client, not stored ([status rule](../../02-requirements/functional/filters.md#status-rule)).

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `purifierId` | string | ✅ | Parent purifier id (equals the path segment) |
| `userId` | string | ✅ | The purifier owner's uid (kept for the legacy owner query) |
| `position` | number | ✅ | 1-based order within the purifier |
| `name` | string | ✅ | Template name in the creator's language at creation |
| `intervalMonths` | number | ✅ | Months between replacements, from the template |
| `lastReplacedAt` | timestamp | ✅ | Installation date, then each recorded replacement date |
| `createdAt` | timestamp | ✅ | Creation time |
| `updatedAt` | timestamp | ✅ | Last change |

## Access

| Operation | Who | Notes |
|-----------|-----|-------|
| Read | Owner, members | Follows the parent purifier; query ordered by `position` |
| Create | Owner | Only with/after the purifier (rules use `getAfter`) |
| Update | Owner, editors | Only `lastReplacedAt`, `intervalMonths`, `updatedAt` |
| Delete | Owner | When deleting the purifier |

## Written by

- `purifierService.create` / `PurifierRepository.create`
- Replacement: `filterService.replaceFilter` / `PurifierRepository.replaceFilter` (then a log entry)

## Related

- Requirements → [FR-004](../../02-requirements/functional/filters.md)
- Parent → [purifiers.md](purifiers.md) · History → [logs.md](logs.md)
