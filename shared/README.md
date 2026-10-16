# Shared data

Data used by every platform app (web, iOS, Android). Edit it here only; each app reads these files directly.

## `purifier-types.json`

Purifier models and their filter templates, bilingual (English/Vietnamese).

```jsonc
[
  {
    "id": "kangaroo-kg102",                 // stable id, stored on purifiers as `typeId` — never rename
    "name": { "en": "...", "vi": "..." },
    "filterTemplates": [
      {
        "position": 1,                       // 1-based order in the purifier
        "name": { "en": "...", "vi": "..." },
        "defaultIntervalMonths": 3,          // replacement interval
        "description": { "en": "...", "vi": "..." }
      }
    ]
  }
]
```

Purifiers in Firestore keep a reference to `id` and their own copy of the filters, so changing a template only affects purifiers created afterwards.

### Adding a model

1. Add an entry with a new unique `id` (`<brand>-<model>`, lowercase).
2. Fill `en` and `vi` for every name and description.
3. Run the web build (`cd web && npm run build`) to type-check the file.

### Kangaroo filter chart codes

Kangaroo models are built from the official Kangaroo filter chart. Filter 1 and filter 6 come in variants (1.1 / 1.2, 6.1 / 6.2):

| Model | Filters (chart codes) |
|-------|-----------------------|
| KG102 | 1.1, 2, 3, 4, 5 |
| KG112 | 1.1, 2, 3, 4, 9 |
| KG103 | 1.1, 2, 3, 4, 5, 6.1 |
| KG113 | 1.1, 2, 3, 4, 5, 9 |
| KG104 | 1.1, 2, 3, 4, 5, 6.1, 7 |
| KG114 | 1.1, 2, 3, 4, 5, 6.1, 9 |
| KG106 | 1.2, 2, 3, 4, 5, 6.1 |
| KG116 | 1.2, 2, 3, 4, 5, 9 |
| KG107 | 1.1, 2, 3, 4, 5, 6.2, 7 |
| KG117 | 1.1, 2, 3, 4, 5, 6.2, 9 |
| KG108 | 1.1, 2, 3, 4, 5, 6.1, 7, 8 |
| KG118 | 1.1, 2, 3, 4, 5, 6.1, 8, 9 |
| KG109 | 1.1, 2, 3, 4, 5, 6.1, 7, 8, 9 |
