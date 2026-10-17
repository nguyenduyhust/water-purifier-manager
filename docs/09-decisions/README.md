# 09 · Decisions (ADRs)

**Last Updated**: 2026-10-17

Architecture Decision Records: one file per decision that is expensive to reverse, explaining the context, the choice and its consequences. Copy [0000-template.md](0000-template.md) for new ones; never rewrite an accepted ADR — supersede it with a new one.

| ADR | Decision | Status | Date |
|-----|----------|--------|------|
| [0001](0001-client-only-firebase.md) | Clients talk directly to Firebase; no app-owned backend | Accepted | 2025-01-07 |
| [0002](0002-monorepo-by-platform.md) | One repo with `web/`, `ios/`, `shared/`, `firebase/` | Accepted | 2026-10-16 |
| [0003](0003-purifier-catalog-as-shared-json.md) | Purifier catalog is bundled JSON in `shared/` | Accepted | 2026-10-16 |
| [0004](0004-share-per-purifier.md) | Share per purifier, roles editor/viewer | Accepted | 2026-10-17 |
| [0005](0005-client-side-invites.md) | Invites as Firestore documents whose id is the link secret | Accepted | 2026-10-17 |
| [0006](0006-history-under-each-purifier.md) | History lives under each purifier; legacy logs migrated | Accepted | 2026-10-17 |
| [0007](0007-local-notifications-for-reminders.md) | Reminders are iOS local notifications | Accepted | 2026-10-16 |
| [0008](0008-native-swiftui-ios-app.md) | Native SwiftUI iOS app (not Capacitor or React Native) | Accepted | 2026-10-16 |
| [0009](0009-owner-and-shared-queries.md) | Owner stays in `userId`; owned and shared purifiers are queried separately | Accepted | 2026-10-17 |

## Earlier decisions (2025-01-07)

Recorded in the original architecture doc's decision log; still in effect:

| Decision | Rationale | Alternatives |
|----------|-----------|--------------|
| Firestore as the database | No backend needed, realtime sync, offline support | Supabase, PocketBase |
| shadcn/ui for web components | Accessible, customizable, Tailwind-based | Material UI, Chakra UI |
| Filters as a subcollection of the purifier | Natural per-purifier queries and rules | Flat collection with `purifierId` |
| React Context (+ hooks) over a state library | Enough for this scope | Redux, Zustand |
| Bilingual catalog data instead of i18n keys | Easier to edit model data | Catalog text in i18n JSON |
| react-i18next for web UI text | Standard, good React integration | FormatJS |
