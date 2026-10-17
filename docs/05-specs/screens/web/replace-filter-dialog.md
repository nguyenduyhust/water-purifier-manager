# W-09 · Replace filter (dialog)

| | |
|---|---|
| **Opened from** | W-07, "Replace Filter" on a filter card |
| **Auth** | Owner or editor |
| **File** | `components/filter/replace-filter-dialog.tsx` |

**Overview**: Record that a filter was replaced.

## Layout

```
┌ Replace filter ───────────────────────┐
│ Replacement date  [📅 2026-10-17    ] │
│ Notes (optional)  [e.g. Replaced with…]│
│                   [Cancel] [Confirm]  │
└───────────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Confirm | Updates the filter's `lastReplacedAt`, then adds a `filter_replaced` log with the user as actor; toast "Filter replaced" |
| Cancel | Closes |

The date defaults to today and is not restricted (iOS limits it to today or earlier).

## Related

- Requirement → [FR-004](../../../02-requirements/functional/filters.md)
- iOS equivalent → [I-08](../ios/replace-filter.md)
