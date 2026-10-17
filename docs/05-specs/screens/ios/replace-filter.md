# I-08 · Replace filter

| | |
|---|---|
| **Entry** | Sheet from I-06 › Replace |
| **Auth** | Owner or editor |
| **File** | `Features/Purifiers/ReplaceFilterSheet.swift` |

## Layout

```
Cancel        Replace filter        Replace
 Filter      Filter 1 - PP 5µm
 Purifier    Kitchen purifier
 Replacement date     17 Oct 2026     (today or earlier)
 Notes (optional)     e.g. Replaced with a genuine filter
```

## Actions

| Element | Action |
|---------|--------|
| Replace | Updates `lastReplacedAt`, then logs `filter_replaced` with the user as actor; closes; the filter row and reminders update |
| Cancel | Closes |

## Related

- Requirement → [FR-004](../../../02-requirements/functional/filters.md)
- Web equivalent → [W-09](../web/replace-filter-dialog.md)
