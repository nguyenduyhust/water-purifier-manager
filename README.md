# Water Purifier Manager

A web application for managing water purifiers and tracking filter replacement schedules. Built with React, TypeScript, and Firebase.

## Features

- **Multi-language Support**: English and Vietnamese (i18n)
- **User Authentication**: Email/Password and Google Sign-In via Firebase Auth
- **Purifier Management**: Add, view, edit, and delete water purifiers
- **Filter Tracking**: Track filter status with automatic replacement date calculations
- **Dashboard**: Overview of all purifiers and filters needing attention
- **Activity History**: View history of purifier creation and filter replacements
- **Real-time Sync**: Data syncs in real-time across browser tabs via Firestore
- **User Profile**: Display user avatar from Google account

## Supported Purifier Types

42 pre-configured models (filter count in parentheses), defined in [`shared/purifier-types.json`](shared/purifier-types.json):
- **Kangaroo**: KG102 (5), KG112 (5), KG103 (6), KG113 (6), KG104 (7), KG114 (7), KG106 (6), KG116 (6), KG107 (7), KG117 (7), KG108 (8), KG118 (8), KG109 (9), KG10A17 (10), KG10A13 (10), KG11A1 (11), KG11A2 (11), KG11A3 (11), KG12A6 (12), KG12A8 Sumire (12), KG400HD (5)
- **Karofi**: KSI80 (8), Optimus O-i229/A (9), KAD-X60 (10), KAD-X58 (11), KAD-X59 (12), KAQ-X18 (11), KAQ-US08 (10)
- **Sunhouse**: SHR76210CK (10), SHA76222KL (11), SHA76623KL (11), SHA76656LA (12), SHA8866K (7), SHA8896L (12)
- **Hòa Phát**: HPN666 (11), HPN669 (12)
- **Toshiba**: TWP-W2396SVN(M) (10)
- **Mutosi**: MP-S1011 (10), MP-S1021H (10)
- **A. O. Smith**: Z7 (5), G1 / G2 (5), R400E (2)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Firebase Auth | Authentication |
| Firebase Firestore | Database |
| react-i18next | Internationalization |
| React Hook Form + Zod | Form Handling |
| date-fns | Date Manipulation |
| Lucide React | Icons |

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Firebase project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/water-purifier-manager.git
cd water-purifier-manager/web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `web/.env.local` with your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Copy your Firebase config to `web/.env.local`
5. Deploy Firestore rules and indexes: `cd firebase && npx firebase-tools deploy --only firestore`

## Project Structure

The web app lives in `web/`:

```
web/src/
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # AppLayout, Header, Sidebar
│   ├── auth/             # LoginForm, RegisterForm, AuthGuard
│   ├── purifier/         # PurifierCard, PurifierForm
│   └── filter/           # FilterCard, ReplaceFilterDialog
├── contexts/
│   └── auth-context.tsx  # Authentication state
├── hooks/
│   ├── use-purifiers.ts  # Purifier CRUD
│   ├── use-purifier.ts   # Single purifier with filters
│   ├── use-filters.ts    # Filter operations
│   └── use-purifier-types.ts  # Localized purifier types
├── services/
│   ├── firebase.ts       # Firebase initialization
│   ├── auth-service.ts   # Auth operations
│   ├── purifier-service.ts
│   ├── filter-service.ts
│   ├── filter-status-service.ts  # Filter status calculations
│   └── activity-log-service.ts   # Activity logging & history
├── pages/
│   ├── auth/             # Login, Register, ForgotPassword
│   ├── dashboard/        # Main dashboard
│   ├── purifiers/        # List, detail, create, edit pages
│   └── history/          # Activity history
├── i18n/
│   ├── index.ts          # i18n configuration
│   └── locales/          # en.json, vi.json
├── data/
│   └── purifier-types.ts # Localization helpers (data in shared/purifier-types.json)
├── types/                # TypeScript interfaces
└── lib/                  # Utilities
```

## Documentation

- [CLAUDE.md](CLAUDE.md) - Project context for Claude Code
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md) - Coding conventions
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) - Project requirements

## Contributing

1. Read `docs/CONVENTIONS.md` for coding standards
2. Create a feature branch from `main`
3. Make your changes with appropriate tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details
