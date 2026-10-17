# Recipes

**Last Updated**: 2026-10-17

Step-by-step guides for changes that touch several places.

## Add a purifier model

1. Add an entry to [`shared/purifier-types.json`](../../shared/purifier-types.json) with a new unique `id` (`<brand>-<model>`, lowercase), and `en`/`vi` text for every name and description. Positions start at 1 and are consecutive.
2. `cd web && npm run build` — type-checks the JSON against `DefaultPurifierType`.
3. Run the iOS unit tests — `PurifierTypeCatalogTests` checks unique ids, both languages, consecutive positions and positive intervals.
4. Update the model table in [`02-requirements/functional/purifiers.md`](../02-requirements/functional/purifiers.md).

Never rename an existing `id`: purifiers reference it as `typeId`. Changing a template only affects purifiers created afterwards.

## Add or change UI text

**Web**: add the key to both `web/src/i18n/locales/en.json` and `vi.json` (keep the files' existing formatting), then use `t('section.key')`.

**iOS**: write the English text in code (`Text("…")`, `String(localized: "…")`). Build once so the compiler extracts the key, then add the Vietnamese translation to `Resources/Localizable.xcstrings` (Xcode's String Catalog editor, or edit the JSON). Use positional specifiers (`%1$@`, `%2$@`) in translations with several arguments, and plural variations for English count strings. Vietnamese wording follows `vi.json`.

## Change the Firestore schema

1. Update the types/models on **both** platforms (`web/src/types/index.ts`, `ios/…/Models/`).
2. Update services/repositories to write the same fields in the same shape.
3. Update `firebase/firestore.rules` if access depends on the field; add tests in `firebase/tests/`.
4. Add indexes for new query shapes to `firebase/firestore.indexes.json`.
5. Make it backward compatible: decoding must tolerate documents without the new field, and rules must still accept what the released clients send.
6. If existing documents need the new shape, write a migration script ([data migrations](../07-operations/data-migrations.md)).
7. Update the collection spec in [`05-specs/database/`](../05-specs/database/README.md).
8. Release in order: rules → web → iOS ([deployment](../07-operations/deployment.md)).

## Add a screen

**Web**: create the page under `src/pages/…`, add the route in `src/App.tsx` (wrap in `AuthGuard` if it needs a user), get data through a hook, add strings to both locale files, and add a spec in [`05-specs/screens/web/`](../05-specs/screens/web/README.md).

**iOS**: add the view under `Features/…` (the synchronized folder picks it up), read stores from the environment, present it from a tab or as a sheet, add translations, and add a spec in [`05-specs/screens/ios/`](../05-specs/screens/ios/README.md).

## Add a Firestore rule

1. Write the rule in `firebase/firestore.rules`, reusing the helper functions (`isOwner`, `isMember`, `canRead`, `canEdit`).
2. Add allow *and* deny tests in `firebase/tests/firestore.rules.test.ts`.
3. Mutation-check: temporarily weaken the rule and confirm a test fails.
4. `npx firebase-tools@latest deploy --only firestore --dry-run`, then deploy ([deployment](../07-operations/deployment.md#firestore-rules-and-indexes)).

## Related

- Conventions → [conventions.md](conventions.md)
- Testing → [`../06-testing/`](../06-testing/README.md)
