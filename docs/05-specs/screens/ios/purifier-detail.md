# I-06 · Purifier detail

| | |
|---|---|
| **Entry** | Tap a purifier (I-05) or a filter (I-04) |
| **Auth** | Owner or member |
| **File** | `Features/Purifiers/PurifierDetailView.swift` |

**Overview**: Details and filters, ordered by urgency, with the actions the role allows in the ⋯ menu.

## Layout

```
Kitchen purifier                                   [⋯]
DETAILS
 Shared by            Alice          ┐ members only
 Your role            Editor         ┘
 Type                 Kangaroo - KG102 (5 filters)
 Location             Kitchen
 Installation date    17 Jun 2026
 Notes …
FILTERS
 Filter 1 - PP 5µm                       [Due soon]
 Every 3 months
 Last replaced       17 Jul 2026
 Next replacement    17 Oct 2026
 12 days left                            [Replace]   owner, editor
 …
 You have view-only access to this purifier.          viewer footer
```

## ⋯ menu

| Item | Role | Action |
|------|------|--------|
| Share (n) | Owner | Opens I-09 |
| Edit | Owner, editor | Opens I-07 in edit mode |
| Delete purifier | Owner | Confirmation dialog, then deletes purifier, filters, history and invites; closes the screen |
| Leave | Editor, viewer | Confirmation dialog, then removes self; closes the screen |

"Replace" opens I-08. If the purifier disappears (deleted, or access removed) the screen shows "Purifier not found".

## Related

- Requirements → [FR-002](../../../02-requirements/functional/purifiers.md), [FR-004](../../../02-requirements/functional/filters.md), [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-07](../web/purifier-detail.md)
