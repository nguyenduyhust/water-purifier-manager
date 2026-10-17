# W-07 · Purifier detail

| | |
|---|---|
| **Route** | `/purifiers/:id` |
| **Auth** | Required; owner or member |
| **File** | `pages/purifiers/detail.tsx` |

**Overview**: A purifier's details and filters, with the actions the user's role allows.

## Layout

```
←  Kitchen purifier                    [Share (2)] [Edit] [Delete]     owner
   Kangaroo - KG102 (5 filters)                      [Edit] [Leave]    editor
   [👥 Shared by Alice]  Your role: Editor                  [Leave]    viewer
┌ Details ─────────────────────────────┐
│ 📍 Kitchen                           │
│ 📅 Installed 17 June, 2026           │
│ notes…                               │
└──────────────────────────────────────┘
Filters (5)
You have view-only access to this purifier.                 viewer only
┌ 1. Filter 1 - PP 5µm  [Due soon · 12 days] ┐  …
│ Last replaced: 17 Jul, 2026                │
│ Next replacement: 17 Oct, 2026 (every 3 m.)│
│ [ ↻ Replace Filter ]                       │  owner, editor
└────────────────────────────────────────────┘
```

Unknown id or no access: "Purifier not found" with a link back to W-05.

## Actions

| Element | Role | Action |
|---------|------|--------|
| Share | Owner | Opens W-10 (count of members shown) |
| Edit | Owner, editor | → W-08 |
| Delete | Owner | Confirm, then delete the purifier, its filters, history and invites; → W-05 |
| Leave | Editor, viewer | Confirm, then remove self; → W-05 |
| Replace Filter | Owner, editor | Opens W-09 |

## Related

- Requirements → [FR-002](../../../02-requirements/functional/purifiers.md), [FR-004](../../../02-requirements/functional/filters.md), [FR-009](../../../02-requirements/functional/sharing.md)
- iOS equivalent → [I-06](../ios/purifier-detail.md)
