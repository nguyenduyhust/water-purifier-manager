# I-11 · History

| | |
|---|---|
| **Entry** | History tab |
| **Files** | `Features/History/HistoryView.swift`, `Stores/HistoryStore.swift` |

**Overview**: The 50 most recent events across all accessible purifiers.

## Layout

```
History
 ↻  Filter replaced
    Kitchen purifier
    Filter 1 - PP 5µm
    by Bob
    Replaced with a genuine filter          (italic)
    17 Oct 2026
 ⊕  Purifier added
    Office
    by Alice
    1 Mar 2026
```

Icons: added (blue), replaced (green), deleted (red), updated/unknown (grey). Empty state: "No history yet". Pull to refresh. Reloads when the tab appears and when the purifier list changes.

## Related

- Requirements → [FR-004](../../../02-requirements/functional/filters.md), [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-12](../web/history.md)
