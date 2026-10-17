# W-04 · Dashboard

| | |
|---|---|
| **Route** | `/` |
| **Auth** | Required |
| **Files** | `pages/dashboard/index.tsx`, `components/sharing/pending-invites.tsx` |

**Overview**: Landing screen. Shows pending email invites, totals across all accessible purifiers, and the filters that need attention.

## Layout

```
Dashboard                                   [+ Add Purifier]
Overview of your water purifiers and filter status

┌ Invites for you ─────────────────────────────────────────┐   only when there are pending email invites
│ Alice invited you to "Kitchen" as Editor  [Accept][Decline]│
└───────────────────────────────────────────────────────────┘
┌Total purifiers┐┌Total filters┐┌Needs attention┐┌Filters OK┐
│      2        ││     12      ││ 3             ││    9     │
│               ││             ││ 1 expired,    ││          │
│               ││             ││ 2 due soon    ││          │
└───────────────┘└─────────────┘└───────────────┘└──────────┘
Filters needing attention
  Expired (1)      Filter 1 - PP · Kitchen        [Expired · overdue 3 days]
  Due soon (2)     Filter 2 - … · Office          [Due soon · 12 days left]
```

With no purifiers: an empty state ("No purifiers yet", "Add Your First Purifier").

## Actions

| Element | Action |
|---------|--------|
| Add Purifier | → W-06 |
| Accept (invite) | Joins the purifier, toast, → W-07 of that purifier |
| Decline (invite) | Marks the invite declined |
| A filter row | → W-07 of its purifier |

## Data

`usePurifiers` (owned + shared), `useAllFilters` (filters with status, stats), `useMyInvites` (email invites, only for verified emails).

## Related

- Requirements → [FR-006](../../../02-requirements/functional/dashboard.md), [FR-009](../../../02-requirements/functional/sharing.md)
- iOS equivalent → [I-04](../ios/dashboard.md)
