# W-08 · Edit purifier

| | |
|---|---|
| **Route** | `/purifiers/:id/edit` |
| **Auth** | Required; owner or editor (viewers are redirected to W-07) |
| **File** | `pages/purifiers/edit.tsx` |

**Overview**: Change a purifier's name, location and notes. The model and installation date can't be changed.

## Layout

```
←  Edit purifier
┌ Details ─────────────────────────┐
│ Name      [Kitchen purifier    ] │
│ Location  [Kitchen             ] │
│ Notes     [                    ] │
│              [Cancel]  [Save]    │
└──────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Save | Validates (name 1–100, location ≤ 200, notes ≤ 500), updates the purifier, toast, → W-07 |
| Cancel / ← | → W-07 |

## Related

- Requirement → [FR-002](../../../02-requirements/functional/purifiers.md)
