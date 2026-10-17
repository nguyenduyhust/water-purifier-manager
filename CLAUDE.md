# Claude Code Project Context

> This file provides context and instructions for Claude Code to understand this project.
> Claude automatically reads this file when working in this repository.

## Project Overview

**Name:** Water Purifier Manager
**Description:** A web app and native iOS app for managing water purifiers and tracking filter replacement schedules. Users can manage multiple purifiers with different filter configurations. Supports Vietnamese water purifier brands (Kangaroo, Karofi, Sunhouse) with bilingual support (English/Vietnamese).
**Tech Stack:** Web — TypeScript, React 18, Vite, Tailwind CSS, shadcn/ui, Firebase (Auth + Firestore), react-i18next. iOS — Swift, SwiftUI (iOS 17+), Firebase iOS SDK, GoogleSignIn

## Quick Start

The repo is organized by platform: the web app lives in `web/`, the iOS app in `ios/` (see [ios/README.md](ios/README.md)). Both share one Firebase backend. Paths like `src/...` below are relative to `web/`.

```bash
cd web

# Install dependencies
npm install

# Run development server
npm run dev

# Run against local Firebase emulators (start them first: cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier)
npm run dev:emulator

# Firestore rules tests (from firebase/)
cd ../firebase && npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
water-purifier-manager/
├── web/                    # React web app (Vite) — run npm commands here
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components (Button, Card, Dialog, etc.)
│   │   │   ├── layout/           # AppLayout, Header, Sidebar
│   │   │   ├── auth/             # LoginForm, RegisterForm, AuthGuard
│   │   │   ├── purifier/         # PurifierCard, PurifierForm
│   │   │   ├── filter/           # FilterCard, ReplaceFilterDialog
│   │   │   └── dashboard/        # StatsCards, FiltersNeedingAttention
│   │   ├── contexts/
│   │   │   └── auth-context.tsx  # Authentication state management
│   │   ├── hooks/
│   │   │   ├── use-purifiers.ts  # Purifier CRUD hook
│   │   │   ├── use-purifier.ts   # Single purifier with filters
│   │   │   ├── use-filters.ts    # Filter operations hook
│   │   │   ├── use-purifier-types.ts  # Localized purifier types
│   │   │   └── use-all-filters.ts     # All filters across purifiers
│   │   ├── services/
│   │   │   ├── firebase.ts       # Firebase initialization
│   │   │   ├── auth-service.ts   # Authentication (Email/Password + Google)
│   │   │   ├── purifier-service.ts    # Purifier CRUD
│   │   │   ├── filter-service.ts      # Filter operations & status
│   │   │   ├── filter-status-service.ts # Filter status calculations
│   │   │   └── activity-log-service.ts  # Activity logging & history
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register, ForgotPassword
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   ├── purifiers/        # Purifier list, detail, create, edit
│   │   │   └── history/          # Activity history page
│   │   ├── i18n/
│   │   │   ├── index.ts          # i18n configuration
│   │   │   └── locales/          # en.json, vi.json translation files
│   │   ├── types/                # TypeScript interfaces
│   │   ├── lib/                  # Utility functions
│   │   ├── config/               # Firebase config
│   │   └── data/                 # Localization helpers over shared/purifier-types.json
│   ├── public/
│   ├── package.json
│   ├── vercel.json           # Vercel config (Root Directory = web)
│   └── .env.local            # Firebase config (not committed)
├── shared/
│   └── purifier-types.json   # Purifier models + filter templates, used by all apps
├── ios/                      # Native SwiftUI app — see ios/README.md
├── firebase/                 # Firestore rules, indexes, emulator config (shared backend)
├── docs/
│   ├── ARCHITECTURE.md       # System architecture
│   ├── CONVENTIONS.md        # Coding conventions
│   └── REQUIREMENTS.md       # Project requirements
└── CLAUDE.md                 # This file
```

## Key Files to Understand

| File/Directory | Purpose |
|----------------|---------|
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Root component with routing |
| `src/services/firebase.ts` | Firebase initialization |
| `src/contexts/auth-context.tsx` | Authentication state (Email/Password + Google) |
| `src/types/` | All TypeScript interfaces |
| `shared/purifier-types.json` | Bilingual purifier definitions shared by all platform apps (see `shared/README.md`) |
| `src/data/purifier-types.ts` | Localization helpers over the shared purifier data |
| `src/i18n/index.ts` | i18n configuration with language detection |
| `src/i18n/locales/*.json` | Translation files (en.json, vi.json) |
| `src/hooks/use-purifier-types.ts` | Hook for localized purifier type data |

## Architecture Decisions

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

### Key Patterns Used

- **Repository Pattern:** Services abstract Firestore operations from components
- **Custom Hooks:** Data fetching and state management encapsulated in hooks
- **Protected Routes:** AuthGuard component wraps authenticated routes
- **Real-time Subscriptions:** Firestore listeners for live data updates

## Coding Conventions

See [docs/CONVENTIONS.md](docs/CONVENTIONS.md) for full coding standards.

### Quick Rules

1. **Naming:** Use camelCase for variables/functions, PascalCase for components/types
2. **Files:** Use kebab-case for file names (e.g., `purifier-card.tsx`)
3. **Imports:** Group: external libs → internal modules → types → styles
4. **Error Handling:** Use typed errors, display user-friendly messages via toast
5. **Comments:** Explain "why" not "what" - code should be self-documenting

## Environment Setup

### Required Environment Variables

```bash
# web/.env.local (copy from web/.env.example)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Firebase project with Authentication and Firestore enabled

## Common Tasks

### Adding a New Purifier Type

1. Add the type to `shared/purifier-types.json` (see `shared/README.md`)
2. Include filter templates with names and default intervals in both languages

### Changing Shared Behavior

Web and iOS must stay in sync on the Firestore schema and filter status rules. When changing either, update both `web/src/services/` and `ios/WaterPurifierManager/` (see "Keeping parity" in `ios/README.md`).

### Adding a New Component

1. Create component in appropriate `src/components/` subdirectory
2. Use shadcn/ui components as building blocks
3. Follow existing patterns for props interface naming (`ComponentNameProps`)

### Working with Firestore

1. Add service methods in `src/services/`
2. Create or update hooks in `src/hooks/`
3. Use hooks in components for data access

## Internationalization (i18n)

### Supported Languages
- English (en) - Default
- Vietnamese (vi)

### How i18n Works

1. **UI Text**: Uses react-i18next with translation files in `src/i18n/locales/`
2. **Purifier Types**: Bilingual data in `shared/purifier-types.json`, localized by helpers in `src/data/purifier-types.ts`
3. **Date Formatting**: Uses date-fns locale (vi, enUS)

### Adding Translations

```typescript
// In components, use the t() function
const { t } = useTranslation();
<h1>{t('purifier.title')}</h1>

// For purifier types, use the hook
const { purifierTypes, getPurifierTypeById } = usePurifierTypes();
// Returns localized data based on current language
```

### Translation File Structure

```json
// src/i18n/locales/en.json
{
  "common": { "save": "Save", "cancel": "Cancel" },
  "purifier": { "title": "Purifiers", "addPurifier": "Add Purifier" },
  "filter": { "filters": "Filters", "replace": "Replace" },
  "dashboard": { "title": "Dashboard" }
}
```

## External Dependencies

| Dependency | Purpose | Docs |
|------------|---------|------|
| Firebase | Auth & Database | https://firebase.google.com/docs |
| shadcn/ui | UI Components | https://ui.shadcn.com |
| React Hook Form | Form handling | https://react-hook-form.com |
| Zod | Schema validation | https://zod.dev |
| date-fns | Date manipulation | https://date-fns.org |
| Lucide React | Icons | https://lucide.dev |
| React Router | Routing | https://reactrouter.com |
| react-i18next | Internationalization | https://react.i18next.com |

## Known Issues & Gotchas

- **Firebase Emulators:** `npm run dev:emulator` (web) connects to the local Auth/Firestore emulators using `web/.env.emulator`. The emulator test tooling pins firebase-tools 13 because newer versions need Java 21
- **Firestore Indexes:** Compound queries need composite indexes — add them to `firebase/firestore.indexes.json` and deploy
- **Auth Persistence:** Firebase handles persistence automatically; don't implement custom token storage

## Database Schema (Firestore)

### Collections

| Collection | Description |
|------------|-------------|
| `purifiers` | Water purifiers; `userId` is the owner, `memberIds`/`roles`/`memberProfiles` list shared members |
| `purifiers/{id}/filters` | Filter cartridges (subcollection) |
| `purifiers/{id}/logs` | History for the purifier, visible to all its members (`actorId`/`actorName`) |
| `invites` | Sharing invites; the document id is the secret in the invite link |
| `activityLogs` | Legacy history from before sharing; read-only for its owner |

### Key Relationships

- Purifier → PurifierType (via `typeId`, types defined in client code)
- Filter → Purifier (via `purifierId`, also subcollection)
- ActivityLog → Purifier/Filter (via `purifierId`, `filterId`)
- Access: owner via `userId`, shared members via `memberIds` with role `editor` or `viewer` (see FR-009 in `docs/REQUIREMENTS.md`). Owned and shared purifiers are fetched with separate queries and merged

### Firestore Security Rules

Source of truth: [`firebase/firestore.rules`](firebase/firestore.rules), covered by emulator tests in `firebase/tests/`. Owners have full control; editors can edit details and replace filters; viewers read only; filters and logs follow their purifier's access.

### Required Composite Indexes

Defined in `firebase/firestore.indexes.json`:

| Collection | Fields | Query scope |
|------------|--------|-------------|
| `purifiers` | `userId` Asc, `createdAt` Desc | Collection |
| `purifiers` | `memberIds` Array-contains, `createdAt` Desc | Collection |
| `activityLogs` | `userId` Asc, `timestamp` Desc | Collection |
| `filters` | `userId` Asc, `position` Asc | Collection group |

## Deployment

- **Web:** Vercel auto-deploys on push to main (Root Directory = `web`)
- **Firestore rules & indexes:** `cd firebase && firebase deploy --only firestore`
- **Environment:** Set Firebase env vars in hosting platform

---

## Instructions for Claude

### Do

- Follow existing code patterns and conventions in this codebase
- Use shadcn/ui components from `src/components/ui/`
- Handle errors gracefully with user-friendly toast notifications
- Use TypeScript strict mode - no `any` types
- Create hooks for data fetching, not direct service calls in components
- Use Firestore real-time listeners where appropriate

### Don't

- Don't modify `.env.local` with real credentials
- Don't use `any` type in TypeScript
- Don't leave commented-out code
- Don't add backend/server code - this is client-side only
- Don't store sensitive data in local storage
- Don't bypass Firestore security rules

### When Unsure

1. Check existing code for patterns (especially hooks and services)
2. Refer to `docs/CONVENTIONS.md` for coding standards
3. Refer to `docs/ARCHITECTURE.md` for structural decisions
4. Ask for clarification before making architectural changes

### Key Domain Concepts

- **Purifier:** A water purification device owned by a user
- **PurifierType:** Template defining filter configuration for a purifier model
- **Filter/Cartridge:** Replaceable component with a replacement interval
- **Filter Status:** OK (>30 days), Warning (1-30 days), Expired (<=0 days)

### Testing Requirements

- Test hooks with mock Firebase services
- Test components with React Testing Library
- Test filter status calculations thoroughly

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(purifier): add purifier creation form`
- `fix(filter): correct status calculation for edge cases`
- `docs(readme): update setup instructions`
