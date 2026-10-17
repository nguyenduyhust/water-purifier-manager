# Filter Requirements

**Version**: 1.2.0
**Last Updated**: 2026-10-17

## Overview

Each purifier has one record per filter cartridge. The app computes when each filter is next due and classifies it, so users can see which filters need attention, and lets them record replacements. Both apps implement the status rule identically; the iOS unit tests pin it against the web's date-fns behavior.

## Data Model Summary

- **Filter** (`purifiers/{id}/filters`): `purifierId`, `userId` (owner), `position`, `name`, `intervalMonths`, `lastReplacedAt`, `createdAt`, `updatedAt` — see [database spec](../../05-specs/database/filters.md)
- **Log** (`purifiers/{id}/logs`): one `filter_replaced` entry per replacement — see [database spec](../../05-specs/database/logs.md)

## Requirements

### FR-004: Filter management and status
- **Priority**: High
- **Status**: Done except interval editing
- **Acceptance criteria**:
  - [x] A purifier's filters are listed with status, last replaced date, next replacement date and interval
  - [x] Status is computed from `lastReplacedAt` and `intervalMonths` (rule below)
  - [x] Filters are ordered by urgency on detail screens (iOS) and in dashboard lists
  - [x] Record a replacement with a date and optional notes — owner and editors
  - [x] Each replacement adds a history entry naming who did it
  - [x] History page lists recent entries (up to 50) across all purifiers the user can access
  - [ ] Change a single filter's interval — the service method exists on the web (`filterService.update`), but no screen exposes it
  - [ ] Per-filter history view — history is shown per user, not per filter

### Status rule

```
next = lastReplacedAt + intervalMonths          (clamped to the last day of shorter months)
days = whole days from now until next            (truncated, like date-fns differenceInDays)

days <= 0        → Expired   (red)
1 <= days <= 30  → Due soon  (orange/yellow, "warning")
days > 30        → OK        (green)
```

Implemented in `web/src/services/filter-status-service.ts` and `ios/WaterPurifierManager/Domain/FilterStatus.swift`. Change both together.

### Sorting by urgency

Expired before due soon before OK; within a status, fewer days first.

## Platform differences

| Behavior | Web | iOS |
|----------|-----|-----|
| Replacement date | Any date | Today or earlier |
| Days text | "N days remaining", overdue, due today | Same, with English plural forms |

---

**Related**: [README](README.md) · [Purifiers](purifiers.md) · [Reminders](reminders.md) · [Dashboard](dashboard.md) · Database: [filters](../../05-specs/database/filters.md), [logs](../../05-specs/database/logs.md) · Screens: [web purifier detail](../../05-specs/screens/web/purifier-detail.md), [iOS replace filter](../../05-specs/screens/ios/replace-filter.md)
