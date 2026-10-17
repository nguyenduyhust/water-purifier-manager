# Purifier Types (catalog)

**File**: [`shared/purifier-types.json`](../../shared/purifier-types.json)
**Last Updated**: 2026-10-17

The catalog of purifier models users choose from. It is static data shipped inside both apps, not stored in Firestore ([ADR-0003](../09-decisions/0003-purifier-catalog-as-shared-json.md)). When a purifier is created, its filters are copied from the chosen model's templates, so later catalog edits don't change existing purifiers.

## Format

```jsonc
[
  {
    "id": "kangaroo-kg102",                  // stable; stored on purifiers as typeId — never rename
    "name": { "en": "Kangaroo - KG102 (5 filters)", "vi": "Kangaroo - KG102 (5 lõi)" },
    "filterTemplates": [
      {
        "position": 1,                       // 1-based, consecutive
        "name": { "en": "Filter 1 - PP 5µm", "vi": "Lõi số 1 - PP 5µm" },
        "defaultIntervalMonths": 3,          // > 0
        "description": { "en": "…", "vi": "…" }
      }
    ]
  }
]
```

Names follow `"<Brand> - <Model> (<N> filters)"`; both apps group models by the part before ` - `, in file order, so a brand's models must be contiguous.

## Contents

42 models: 21 Kangaroo, 7 Karofi, 6 Sunhouse, 2 Hòa Phát, 1 Toshiba, 2 Mutosi, 3 A. O. Smith; 2 to 12 filters each. Intervals use the manufacturer's value, the lower bound when a range is published, or a typical default when none is. Kangaroo filter chart codes (1.1, 1.2, 6.1, 6.2…) per model are documented in [`shared/README.md`](../../shared/README.md).

## Consumers

| App | Access |
|-----|--------|
| Web | `web/src/data/purifier-types.ts` imports the JSON (`@shared/purifier-types.json`) and exposes localized helpers; `usePurifierTypes()` picks the language |
| iOS | `PurifierTypeCatalog.load()` decodes the bundled file; `LocalizedText.resolved()` picks the language the app runs in |

## Validation

- Web build type-checks the JSON against `DefaultPurifierType`.
- iOS `PurifierTypeCatalogTests`: unique ids, both languages present, positions 1…n, intervals > 0, brands grouped in file order.

## Related

- Requirements → [FR-003](../02-requirements/functional/purifiers.md#fr-003-purifier-types)
- How to add a model → [recipes](../04-development/recipes.md#add-a-purifier-model)
