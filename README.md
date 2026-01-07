# Water Purifier Manager

A web application for managing water purifiers and tracking filter replacement schedules. Built with React, TypeScript, and Firebase.

## Features

- **Multi-language Support**: English and Vietnamese (i18n)
- **User Authentication**: Email/Password and Google Sign-In via Firebase Auth
- **Purifier Management**: Add, view, edit, and delete water purifiers
- **Filter Tracking**: Track filter status with automatic replacement date calculations
- **Dashboard**: Overview of all purifiers and filters needing attention
- **Real-time Sync**: Data syncs in real-time across browser tabs via Firestore

## Supported Purifier Types

Pre-configured Vietnamese water purifier brands:
- **Kangaroo**: KG108 (8 filters), KG100HQ (9 filters), KG104 Hydrogen (10 filters)
- **Karofi**: KSI80 (8 filters), Optimus O-i229 (9 filters), KAD-X60 (10 filters)
- **Sunhouse**: SHR76210CK (10 filters)

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
cd water-purifier-manager

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

Create a `.env.local` file with your Firebase configuration:

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
4. Copy your Firebase config to `.env.local`

## Project Structure

```
src/
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
│   └── filter-service.ts
├── pages/
│   ├── auth/             # Login, Register, ForgotPassword
│   ├── dashboard/        # Main dashboard
│   ├── purifiers/        # List, detail, create pages
│   └── settings/         # Language settings
├── i18n/
│   ├── index.ts          # i18n configuration
│   └── locales/          # en.json, vi.json
├── data/
│   └── purifier-types.ts # Bilingual purifier definitions
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
