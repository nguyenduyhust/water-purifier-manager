# I-04 · Dashboard

| | |
|---|---|
| **Entry** | Dashboard tab |
| **Files** | `Features/Dashboard/DashboardView.swift`, `PendingInvitesSection` in `Features/Sharing/SharingViews.swift` |

**Overview**: Pending email invites, totals, and filters needing attention across all accessible purifiers.

## Layout

```
Dashboard
┌ Invites for you ──────────────────────────────┐   only when there are pending email invites
│ Alice invited you to "Kitchen" as Editor      │
│ [Accept] [Decline]                            │
└───────────────────────────────────────────────┘
┌──────────────┐ ┌──────────────┐
│ 💧 2         │ │ ≡ 12         │
│ Purifiers    │ │ Filters      │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ ⚠ 3          │ │ ✓ 9          │   ⚠ red when anything is expired, else orange
│ Needs attn.  │ │ Filters OK   │
└──────────────┘ └──────────────┘
Filters needing attention
 ⛔ Filter 1 - PP 5µm · Kitchen        Overdue by 3 days  ›
 ⚠ Filter 2 - … · Office               12 days left       ›
```

When nothing needs attention: "All filters are OK". With no purifiers: "No purifiers yet" and "Add your first purifier".

## Actions

| Element | Action |
|---------|--------|
| Accept / Decline | Joins the purifier / declines the invite |
| A filter row | → I-06 |
| Add your first purifier | Opens I-07 |

## Related

- Requirements → [FR-006](../../../02-requirements/functional/dashboard.md), [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-04](../web/dashboard.md)
