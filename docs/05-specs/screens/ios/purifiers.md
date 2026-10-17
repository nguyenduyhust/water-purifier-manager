# I-05 · Purifiers

| | |
|---|---|
| **Entry** | Purifiers tab |
| **File** | `Features/Purifiers/PurifierListView.swift` |

**Overview**: Every purifier the user owns or that is shared with them, newest first, with the worst filter status.

## Layout

```
Purifiers                                    [+]
┌ Kitchen purifier                [Due soon] ›┐
│ Kangaroo - KG102 (5 filters)                │
│ 📍 Kitchen                                  │
├ Office                          [OK]       ›┤
│ Karofi - KSI80                              │
│ 👥 Shared · Editor                          │
└─────────────────────────────────────────────┘
```

The **+** menu offers **Add purifier** (I-07) and **Join with invite link** (I-10). Empty state: "No purifiers yet" with "Add purifier".

## Related

- Requirements → [FR-002](../../../02-requirements/functional/purifiers.md), [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-05](../web/purifiers.md)
