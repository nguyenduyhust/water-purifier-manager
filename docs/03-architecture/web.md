# Web App Architecture

**Last Updated**: 2026-10-17

The web app (`web/`) is a React single-page app built with Vite and served as static files by Vercel. It holds no server-side code; everything happens in the browser against Firebase.

## Layers

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Pages | `src/pages/` | Route-level screens: auth, dashboard, purifiers (list, new, detail, edit), history, invite |
| Components | `src/components/` | `ui/` (shadcn/ui primitives), `layout/` (app shell), `auth/`, `purifier/`, `filter/`, `sharing/`, `app-logo.tsx`, `language-switcher.tsx` |
| Context | `src/contexts/auth-context.tsx` | Current Firebase user, loading flag, sign-in/out actions |
| Hooks | `src/hooks/` | Data and actions for screens: `use-purifiers`, `use-purifier`, `use-all-filters`, `use-filters`, `use-history`, `use-sharing`, `use-my-invites`, `use-purifier-types`, `use-toast` |
| Services | `src/services/` | Firestore and Auth access: `purifier-service`, `filter-service`, `activity-log-service`, `sharing-service`, `auth-service`; pure rules in `filter-status-service` |
| Lib | `src/lib/` | `sharing.ts` (roles, invite links, actor), `return-to.ts` (post-sign-in redirect), `utils.ts` |
| Types | `src/types/index.ts` | Document and view-model types |
| Data | `src/data/purifier-types.ts` | Localization helpers over `shared/purifier-types.json` (imported via the `@shared` alias) |
| Config | `src/config/firebase.ts` | Firebase initialization from `VITE_FIREBASE_*`; connects to emulators when `VITE_FIREBASE_EMULATORS=true` |

## Routing

Defined in `src/App.tsx` with React Router. Protected routes are wrapped in `AuthGuard`, which redirects signed-out users to `/login` with the original location in router state.

| Route | Page | Auth |
|-------|------|------|
| `/login`, `/register`, `/forgot-password` | Auth pages | Public (signed-in users are redirected onward) |
| `/` | Dashboard | Required |
| `/purifiers` | Purifier list | Required |
| `/purifiers/new` | New purifier | Required |
| `/purifiers/:id` | Purifier detail | Required |
| `/purifiers/:id/edit` | Edit purifier (owner, editor) | Required |
| `/history` | History | Required |
| `/invite/:inviteId` | Accept an invite | Required |
| `*` | Redirect to `/` | — |

`web/vercel.json` rewrites every non-asset path to `index.html` so deep links (including invite links) load the SPA.

After sign-in, `lib/return-to.ts` sends the user back to the page they came from. The path is also kept in `sessionStorage` because Google's redirect sign-in reloads the page; only same-app paths are accepted.

## State and data flow

```
Firestore ──onSnapshot──▶ service.subscribe…() ──callback──▶ hook (useState) ──▶ page re-renders
page action ──▶ hook action ──▶ service write ──▶ Firestore ──▶ (snapshot flows back as above)
```

- Hooks own subscriptions and clean them up on unmount.
- Filter status is derived in hooks with `filterStatusService.calculateAllStatuses` and sorted with `sortByUrgency`.
- Roles come from `getAccessRole(purifier, uid)`; pages hide actions the role can't perform.
- History is fetched (not streamed) by `useHistory` from every accessible purifier's `logs`, plus legacy `activityLogs`, de-duplicated by id.

## UI conventions

- shadcn/ui components from `src/components/ui/`, Tailwind for layout.
- User feedback through toasts (`hooks/use-toast`): success messages and user-friendly errors; details go to `console.error`.
- Forms use React Hook Form with Zod schemas (purifier form, replace-filter dialog, auth forms).

## Internationalization

`src/i18n/index.ts` configures i18next with `en` and `vi` resources, detection order `localStorage` → browser, cache in `localStorage`, fallback `vi`. Dates use date-fns with the matching locale. Catalog names come from `usePurifierTypes()`, which picks the language from the bilingual JSON.

## Build and environments

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server against the Firebase project in `.env.local` |
| `npm run dev:emulator` | Dev server against local emulators (`.env.emulator`, demo project) |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run lint` | ESLint |

## Related

- iOS counterpart → [ios.md](ios.md)
- Data access → [data-access.md](data-access.md)
- Screens → [`../05-specs/screens/web/`](../05-specs/screens/web/README.md)
- Conventions → [`../04-development/conventions.md`](../04-development/conventions.md)
