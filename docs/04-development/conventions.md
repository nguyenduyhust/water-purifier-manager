# Coding Conventions

**Last Updated**: 2026-10-17

How code in this repo is written. The goal is that any file reads like its neighbours. When in doubt, copy the pattern of the closest existing file.

## General

- **Explain why, not what.** Comments say why something is done when the code can't; no comments that restate the code. No commented-out code.
- **Keep it simple.** No abstractions for a single use; no speculative options (YAGNI).
- **Same behavior on web and iOS.** If a change affects the Firestore schema, the filter status rule or sharing, change both apps in the same PR and update the shared spec.
- **Security lives in rules.** UI checks are for usability; anything that must be enforced goes in `firebase/firestore.rules` with a test.

## TypeScript / React (web)

### Language
- `strict` mode; no `any`. Prefer types from `src/types/index.ts`; use `type` imports for types.
- `async/await` over promise chains; handle errors where the user sees them.

### Naming
| Thing | Convention | Example |
|-------|------------|---------|
| Files | kebab-case | `purifier-card.tsx`, `use-sharing.ts` |
| Components, types | PascalCase | `PurifierCard`, `AccessRole` |
| Variables, functions | camelCase | `getAccessRole`, `isOwner` |
| Hooks | `useX` in `use-x.ts` | `useMyInvites` |
| Props interfaces | `ComponentNameProps` | `ShareDialogProps` |
| Event handlers | `handleX` inside components, `onX` props | `handleLeave`, `onReplace` |

### Imports
Group in this order: external libraries, internal modules (`@/…`), types, styles. Use the `@/` alias for `src/` and `@shared/` for the repo's `shared/` folder.

### Structure
- Pages compose components and call hooks. **Components never call services or Firestore directly.**
- Hooks own state and subscriptions (`useEffect` returns the unsubscribe) and expose actions.
- Services are plain objects of functions over Firestore (`purifierService.create(...)`); they convert `Date` ↔ `Timestamp`.
- Pure logic (no Firebase) goes in a service like `filter-status-service` or in `src/lib/`.

### UI
- Build from shadcn/ui components in `src/components/ui/`; style with Tailwind utility classes.
- Forms: React Hook Form + Zod schema next to the form.
- Feedback: `toast()` for success and user-friendly errors; log the technical error with `console.error`.
- Every user-visible string goes through `t('…')` with keys in both `en.json` and `vi.json`.
- Use real `<button>`/`<a>`; give icon-only buttons an `aria-label`; mark decorative icons `aria-hidden`.

## Swift / SwiftUI (iOS)

- Swift 5 language mode; stores are `@MainActor @Observable final class`.
- Views get stores from the environment (`@Environment(PurifierStore.self)`); views never touch Firestore.
- Repositories are `struct`s with `async throws` methods and listener functions returning `ListenerRegistration`.
- Firestore callbacks hop to the main actor with `MainActor.assumeIsolated`.
- Decode documents with `Codable` and `try?` per document so one bad document can't break a list.
- Pure logic lives in `Domain/` and has Swift Testing tests.
- User-visible text: `Text("English source")` / `String(localized:)`; add the Vietnamese translation to `Localizable.xcstrings` (see [recipes](recipes.md#add-or-change-ui-text)).
- Debug-only code (emulator wiring) is wrapped in `#if DEBUG`.

## Firestore

- Field names are identical on both platforms; see [`05-specs/database/`](../05-specs/database/README.md).
- Store dates as `Timestamp`; convert at the service/repository boundary.
- Optional activity-log fields are written as `null`, not omitted.
- Group writes that must succeed together into a batch (purifier + filters; accept invite).
- New query shapes need an index in `firebase/firestore.indexes.json` and must be provable by the rules (rules filter queries; they don't filter results).
- Never rely on client checks for access; add or update a rules test for every rule change.

## Lint and format

- Web: `npm run lint` (ESLint 9 with typescript-eslint and react-hooks). There is no Prettier config; match the surrounding style (2-space indent, single quotes, semicolons, trailing commas).
- iOS: Xcode defaults (4-space indent). Builds should have no warnings.

## Related

- Workflow → [workflow.md](workflow.md)
- Architecture → [`../03-architecture/`](../03-architecture/README.md)
