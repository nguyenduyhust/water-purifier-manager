# W-06 · New purifier

| | |
|---|---|
| **Route** | `/purifiers/new` |
| **Auth** | Required |
| **Files** | `pages/purifiers/new.tsx`, `components/purifier/purifier-form.tsx` |

**Overview**: Create a purifier from a catalog model. Its filters are created automatically.

## Layout

```
← Add new water purifier
┌ Purifier details ───────────────────────────┐
│ Name              [e.g. Kitchen purifier  ] │
│ Purifier type     [Select a purifier type ▾]│
│ ┌ Filters: ────────────────────────────┐    │  appears after choosing a type
│ │ Filter 1 - PP 5µm - 3 months          │    │
│ │ Filter 2 - Activated Carbon - 6 months│    │
│ └───────────────────────────────────────┘    │
│ Location          [e.g. Kitchen, Living…  ] │
│ Installation date [📅 2026-10-17          ] │
│ Notes             [                       ] │
│ [                 Save                    ] │
└─────────────────────────────────────────────┘
```

## Fields

| Field | Rule |
|-------|------|
| Name | Required, ≤ 100 |
| Purifier type | Required; list of the 17 catalog models in the current language |
| Location | Optional, ≤ 200 |
| Installation date | Required; defaults to today |
| Notes | Optional, ≤ 500 |

## Actions

| Element | Action |
|---------|--------|
| Save | Creates the purifier and filters (one batch) and a "purifier created" log; toast; → W-05 |
| ← | → W-05 |

## Related

- Requirement → [FR-002](../../../02-requirements/functional/purifiers.md)
- Collections → [purifiers](../../database/purifiers.md), [filters](../../database/filters.md)
