# Claude Code Project Context

> This file provides context and instructions for Claude Code to understand this project.
> Claude automatically reads this file when working in this repository.

## Project Overview

**Name:** Water Purifier Manager
**Description:** A web application for managing water purifiers and tracking filter replacement schedules. Users can manage multiple purifiers with different filter configurations. Supports Vietnamese water purifier brands (Kangaroo, Karofi, Sunhouse) with bilingual support (English/Vietnamese).
**Tech Stack:** TypeScript, React 18, Vite, Tailwind CSS, shadcn/ui, Firebase (Auth + Firestore), react-i18next

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
water-purifier-manager/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (Button, Card, Dialog, etc.)
│   │   ├── layout/           # AppLayout, Header, Sidebar
│   │   ├── auth/             # LoginForm, RegisterForm, AuthGuard
│   │   ├── purifier/         # PurifierCard, PurifierForm
│   │   ├── filter/           # FilterCard, ReplaceFilterDialog
│   │   └── dashboard/        # StatsCards, FiltersNeedingAttention
│   ├── contexts/
│   │   └── auth-context.tsx  # Authentication state management
│   ├── hooks/
│   │   ├── use-purifiers.ts  # Purifier CRUD hook
│   │   ├── use-purifier.ts   # Single purifier with filters
│   │   ├── use-filters.ts    # Filter operations hook
│   │   ├── use-purifier-types.ts  # Localized purifier types
│   │   └── use-all-filters.ts     # All filters across purifiers
│   ├── services/
│   │   ├── firebase.ts       # Firebase initialization
│   │   ├── auth-service.ts   # Authentication (Email/Password + Google)
│   │   ├── purifier-service.ts    # Purifier CRUD
│   │   ├── filter-service.ts      # Filter operations & status
│   │   ├── activity-log-service.ts # Unified activity logging
│   │   └── history-service.ts     # History events retrieval
│   ├── pages/
│   │   ├── auth/             # Login, Register, ForgotPassword
│   │   ├── dashboard/        # Main dashboard
│   │   ├── purifiers/        # Purifier list, detail, create, edit
│   │   └── history/          # Activity history page
│   ├── i18n/
│   │   ├── index.ts          # i18n configuration
│   │   └── locales/          # en.json, vi.json translation files
│   ├── types/                # TypeScript interfaces
│   ├── lib/                  # Utility functions
│   ├── config/               # Firebase config
│   └── data/                 # Bilingual purifier type definitions
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
| `src/data/purifier-types.ts` | Bilingual purifier definitions with localization helpers |
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
# .env.local (copy from .env.example)
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

1. Add type definition in `src/data/purifier-types.ts`
2. Include filter templates with names and default intervals

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
2. **Purifier Types**: Bilingual data hardcoded in `src/data/purifier-types.ts` with helper functions
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

- **Firebase Emulators:** For local development, configure emulators in `firebase.ts`
- **Firestore Indexes:** Compound queries may require composite indexes (check console for errors)
- **Auth Persistence:** Firebase handles persistence automatically; don't implement custom token storage

## Database Schema (Firestore)

### Collections

| Collection | Description |
|------------|-------------|
| `purifiers` | User's water purifiers |
| `purifiers/{id}/filters` | Filter cartridges (subcollection) |
| `activityLogs` | Unified activity history (purifier created, filter replaced) |

### Key Relationships

- Purifier → PurifierType (via `typeId`, types defined in client code)
- Filter → Purifier (via `purifierId`, also subcollection)
- ActivityLog → Purifier/Filter (via `purifierId`, `filterId`)
- All user data filtered by `userId`

### Firestore Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Purifiers collection
    match /purifiers/{purifierId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;

      // Filters subcollection
      match /filters/{filterId} {
        allow read: if request.auth != null && resource.data.userId == request.auth.uid;
        allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
        allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      }
    }

    // Activity Logs collection
    match /activityLogs/{logId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Required Composite Indexes

| Collection | Fields | Query scope |
|------------|--------|-------------|
| `purifiers` | `userId` Asc, `createdAt` Desc | Collection |
| `activityLogs` | `userId` Asc, `timestamp` Desc | Collection |
| `filters` | `userId` Asc, `position` Asc | Collection group |

## Deployment

- **Firebase Hosting:** `npm run build && firebase deploy`
- **Vercel/Netlify:** Connect repo, auto-deploys on push to main
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
