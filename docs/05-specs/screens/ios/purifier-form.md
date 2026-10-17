# I-07 · New / edit purifier

| | |
|---|---|
| **Entry** | Sheet: I-05 › + › Add purifier, I-04 empty state, or I-06 › ⋯ › Edit |
| **File** | `Features/Purifiers/PurifierFormView.swift` |

**Overview**: One form in two modes. *Create* picks a model and installation date; *edit* changes only name, location and notes.

## Layout (create)

```
Cancel        New purifier          Save
┌──────────────────────────────────────┐
│ Name       e.g. Kitchen purifier     │
│ Location   e.g. Kitchen, Living room │
├──────────────────────────────────────┤
│ Purifier type        Select a … ›    │   grouped by brand (Kangaroo, Karofi, Sunhouse)
│ Installation date    17 Oct 2026     │   today or earlier
└──────────────────────────────────────┘
 Filter replacement dates are calculated from the installation date.
FILTERS                                     after choosing a type
 Filter 1 - PP 5µm   Every 3 months
 …
NOTES
 Additional notes about this purifier…
```

Edit mode ("Edit purifier") shows only Name, Location and Notes.

## Validation

Name required and ≤ 100, location ≤ 200, notes ≤ 500, type required when creating. Save is disabled until valid; the sheet can't be swiped away while saving.

## Related

- Requirement → [FR-002](../../../02-requirements/functional/purifiers.md)
- Web equivalents → [W-06](../web/purifier-new.md), [W-08](../web/purifier-edit.md)
