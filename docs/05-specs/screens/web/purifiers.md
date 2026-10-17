# W-05 · Purifier list

| | |
|---|---|
| **Route** | `/purifiers` |
| **Auth** | Required |
| **Files** | `pages/purifiers/index.tsx`, `components/purifier/purifier-card.tsx` |

**Overview**: Cards for every purifier the user owns or that is shared with them, newest first.

## Layout

```
Water purifiers                             [+ Add Purifier]
┌ Kitchen purifier            › ┐ ┌ Office                    › ┐
│ Kangaroo - KG102 (5 filters)  │ │ Karofi - KSI80              │
│ 👥 Sharing (2)                │ │ [👥 Shared · Editor]        │
│ 📍 Kitchen                    │ │ 📅 Installed 1 March, 2026  │
│ 📅 Installed 17 June, 2026    │ │ [2 due soon]                │
│ [1 expired] [2 due soon]      │ │                             │
└───────────────────────────────┘ └─────────────────────────────┘
```

- Owned purifiers that are shared show "Sharing (n)".
- Purifiers shared with the user show "Shared · <role>".
- Status badges summarize expired and due-soon filters, or "Filters OK".

Empty state as on the dashboard.

## Actions

| Element | Action |
|---------|--------|
| Card | → W-07 |
| Add Purifier | → W-06 |

## Related

- Requirement → [FR-002](../../../02-requirements/functional/purifiers.md)
- iOS equivalent → [I-05](../ios/purifiers.md)
