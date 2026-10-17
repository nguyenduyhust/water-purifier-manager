# W-12 · History

| | |
|---|---|
| **Route** | `/history` |
| **Auth** | Required |
| **Files** | `pages/history/index.tsx`, `hooks/use-history.ts` |

**Overview**: The 50 most recent events across every purifier the user can access, grouped by day.

## Layout

```
History
View all activities of your water purifiers

Friday, 17 October 2026
┌ (↻) Filter replaced                         14:05 ┐
│     Kitchen purifier                              │  link to W-07
│     1. Filter 1 - PP 5µm                          │
│     by Bob                                        │
│     "Replaced with a genuine filter"              │
└───────────────────────────────────────────────────┘
┌ (💧) Purifier added                         09:00 ┐
│     Office                                        │
│     by Alice                                      │
└───────────────────────────────────────────────────┘
```

Empty state: "No history yet".

## Data

Fetched when the page opens: each accessible purifier's `logs` plus the user's legacy `activityLogs`, de-duplicated by id. "by <name>" appears when the entry has an actor (all current and migrated entries). See [data access](../../../03-architecture/data-access.md#history).

## Related

- Requirements → [FR-004](../../../02-requirements/functional/filters.md), [FR-009](../../../02-requirements/functional/sharing.md)
- Collections → [logs](../../database/logs.md), [activityLogs](../../database/activity-logs.md)
- iOS equivalent → [I-11](../ios/history.md)
