# Architecture Documentation - Water Purifier Manager

> This document describes the system architecture and design decisions for the Water Purifier Manager application.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Water Purifier Manager                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite + TypeScript)                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │    Pages    │  │ Components  │  │     State Management    │ │   │
│  │  │  (Routes)   │──│   (UI)      │──│   (React Context/Hooks) │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  │         │                │                      │               │   │
│  │         └────────────────┴──────────────────────┘               │   │
│  │                          │                                       │   │
│  │  ┌───────────────────────┴────────────────────────────────────┐ │   │
│  │  │                    Services Layer                           │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │   │
│  │  │  │    Auth     │  │  Firestore  │  │  Business Logic     │ │ │   │
│  │  │  │   Service   │  │   Service   │  │  (Filter Status)    │ │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Firebase SDK (Client)                       │   │
│  │  ┌─────────────────────┐    ┌─────────────────────────────────┐ │   │
│  │  │  Firebase Auth      │    │  Firebase Firestore             │ │   │
│  │  │  (Authentication)   │    │  (Database)                     │ │   │
│  │  └─────────────────────┘    └─────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Firebase Cloud Services                           │
│  ┌─────────────────────────┐    ┌─────────────────────────────────────┐ │
│  │  Authentication         │    │  Cloud Firestore                    │ │
│  │  - Email/Password       │    │  - Real-time sync                   │ │
│  │  - Session management   │    │  - Offline support                  │ │
│  └─────────────────────────┘    │  - Security rules                   │ │
│                                  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI Framework | React 18+ | Component-based UI |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Fast development & builds |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | shadcn/ui | Pre-built accessible components |
| Routing | React Router v6 | Client-side routing |
| Forms | React Hook Form + Zod | Form handling & validation |
| Date Handling | date-fns | Date manipulation |
| Icons | Lucide React | SVG icons |
| Auth | Firebase Auth | User authentication |
| Database | Firebase Firestore | NoSQL document database |
| i18n | react-i18next | Internationalization |

---

## Layer Descriptions

### 1. Presentation Layer (Pages & Components)

**Purpose:** Render UI and handle user interactions

**Structure:**
```
src/
├── pages/                    # Route-level components
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── dashboard/
│   │   └── index.tsx
│   ├── purifiers/
│   │   ├── index.tsx         # List view
│   │   ├── [id].tsx          # Detail view
│   │   └── new.tsx           # Create form
│   └── settings/
│       └── index.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── app-layout.tsx
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── auth/                 # Auth-specific components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-guard.tsx
│   ├── purifier/             # Purifier-specific components
│   │   ├── purifier-card.tsx
│   │   ├── purifier-form.tsx
│   │   ├── purifier-list.tsx
│   │   └── purifier-type-select.tsx
│   ├── filter/               # Filter-specific components
│   │   ├── filter-card.tsx
│   │   ├── filter-list.tsx
│   │   ├── filter-status-badge.tsx
│   │   ├── filter-replacement-dialog.tsx
│   │   └── filter-history.tsx
│   └── dashboard/            # Dashboard components
│       ├── stats-overview.tsx
│       ├── upcoming-replacements.tsx
│       └── purifier-summary.tsx
```

**Key Components:**

| Component | Responsibility |
|-----------|----------------|
| `AppLayout` | Main layout with header, sidebar, content area |
| `AuthGuard` | Protects routes, redirects unauthenticated users |
| `PurifierCard` | Displays purifier summary with filter status |
| `FilterCard` | Shows individual filter with status and actions |
| `FilterStatusBadge` | Visual indicator (OK/Warning/Expired) |

---

### 2. State Management Layer

**Purpose:** Manage application state and data flow

**Approach:** React Context + Custom Hooks (no external state library needed for this scope)

**Structure:**
```
src/
├── contexts/
│   ├── auth-context.tsx      # Authentication state
│   └── notification-context.tsx  # Toast notifications
├── hooks/
│   ├── use-auth.ts           # Auth hook wrapper
│   ├── use-purifiers.ts      # Purifier CRUD operations
│   ├── use-purifier.ts       # Single purifier with filters
│   ├── use-filters.ts        # Filter operations
│   ├── use-purifier-types.ts # Purifier type management
│   └── use-filter-status.ts  # Filter status calculations
```

**State Structure:**

```typescript
// Auth Context State
interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// Purifier Hook Return
interface UsePurifiersReturn {
  purifiers: Purifier[];
  loading: boolean;
  error: Error | null;
  addPurifier: (data: CreatePurifierData) => Promise<string>;
  updatePurifier: (id: string, data: UpdatePurifierData) => Promise<void>;
  deletePurifier: (id: string) => Promise<void>;
}
```

---

### 3. Services Layer

**Purpose:** Handle business logic and external service communication

**Structure:**
```
src/
├── services/
│   ├── firebase.ts           # Firebase initialization
│   ├── auth-service.ts       # Authentication operations
│   ├── purifier-service.ts   # Purifier CRUD
│   ├── filter-service.ts     # Filter operations
│   ├── purifier-type-service.ts  # Purifier type operations
│   └── filter-status-service.ts  # Status calculation logic
```

**Key Services:**

#### Auth Service
```typescript
interface AuthService {
  signUp(email: string, password: string): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
}
```

#### Purifier Service
```typescript
interface PurifierService {
  getAll(userId: string): Promise<Purifier[]>;
  getById(id: string): Promise<Purifier | null>;
  create(data: CreatePurifierData): Promise<string>;
  update(id: string, data: UpdatePurifierData): Promise<void>;
  delete(id: string): Promise<void>;
  subscribeToAll(userId: string, callback: (purifiers: Purifier[]) => void): Unsubscribe;
}
```

#### Filter Status Service
```typescript
interface FilterStatusService {
  calculateStatus(filter: Filter): FilterStatus;
  getNextReplacementDate(lastReplaced: Date, intervalMonths: number): Date;
  getDaysUntilReplacement(nextReplacement: Date): number;
  getFiltersNeedingAttention(filters: Filter[]): Filter[];
}
```

---

### 4. Data Layer (Firebase)

**Purpose:** Data persistence and real-time synchronization

**Firestore Collection Structure:**

```
firestore/
├── purifierTypes/                    # Collection
│   └── {typeId}/                     # Document
│       ├── id: string
│       ├── name: string
│       ├── isCustom: boolean
│       ├── userId: string | null
│       ├── filterTemplates: FilterTemplate[]
│       └── createdAt: Timestamp
│
├── purifiers/                        # Collection
│   └── {purifierId}/                 # Document
│       ├── id: string
│       ├── userId: string
│       ├── typeId: string
│       ├── name: string
│       ├── location: string
│       ├── installationDate: Timestamp
│       ├── notes: string
│       ├── createdAt: Timestamp
│       ├── updatedAt: Timestamp
│       │
│       └── filters/                  # Subcollection
│           └── {filterId}/           # Document
│               ├── id: string
│               ├── purifierId: string
│               ├── userId: string
│               ├── position: number
│               ├── name: string
│               ├── intervalMonths: number
│               ├── lastReplacedAt: Timestamp
│               ├── createdAt: Timestamp
│               └── updatedAt: Timestamp
│
└── filterReplacements/               # Collection
    └── {replacementId}/              # Document
        ├── id: string
        ├── filterId: string
        ├── userId: string
        ├── replacedAt: Timestamp
        ├── notes: string
        └── createdAt: Timestamp
```

---

## Data Flow

### Authentication Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Login   │───▶│  AuthService │───▶│ Firebase    │───▶│ Auth State   │
│  Form    │    │  signIn()    │    │ Auth        │    │ Updated      │
└──────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                              │
                                                              ▼
                                                       ┌──────────────┐
                                                       │ Redirect to  │
                                                       │ Dashboard    │
                                                       └──────────────┘
```

### Purifier Data Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  User    │───▶│ usePurifiers │───▶│ Purifier    │───▶│ Firestore    │
│  Action  │    │ Hook         │    │ Service     │    │              │
└──────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                       ▲                                      │
                       │         Real-time Subscription       │
                       └──────────────────────────────────────┘
```

### Filter Status Calculation Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────┐
│  Filter  │───▶│ FilterStatus │───▶│ Calculate Days  │───▶│  Status  │
│  Data    │    │ Service      │    │ Until Replace   │    │  Badge   │
└──────────┘    └──────────────┘    └─────────────────┘    └──────────┘

Status Logic:
- daysRemaining > 30  →  OK (Green)
- daysRemaining 1-30  →  Warning (Yellow)
- daysRemaining <= 0  →  Expired (Red)
```

---

## Design Patterns

### Pattern 1: Repository Pattern (Services)

**Problem:** Decouple data access from business logic

**Solution:** Services abstract Firestore operations

```typescript
// purifier-service.ts
export const purifierService = {
  async getAll(userId: string): Promise<Purifier[]> {
    const q = query(
      collection(db, 'purifiers'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Purifier[];
  },

  subscribeToAll(userId: string, callback: (purifiers: Purifier[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'purifiers'),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const purifiers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Purifier[];
      callback(purifiers);
    });
  }
};
```

---

### Pattern 2: Custom Hooks for Data Fetching

**Problem:** Share data fetching logic across components

**Solution:** Custom hooks encapsulate data operations

```typescript
// use-purifiers.ts
export function usePurifiers() {
  const { user } = useAuth();
  const [purifiers, setPurifiers] = useState<Purifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = purifierService.subscribeToAll(user.uid, (data) => {
      setPurifiers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addPurifier = async (data: CreatePurifierData) => {
    return purifierService.create({ ...data, userId: user!.uid });
  };

  return { purifiers, loading, error, addPurifier, /* ... */ };
}
```

---

### Pattern 3: Compound Components (UI)

**Problem:** Build flexible, composable UI components

**Solution:** Use compound component pattern for complex UIs

```typescript
// filter-card.tsx
export function FilterCard({ filter, onReplace, onEdit }: FilterCardProps) {
  const status = filterStatusService.calculateStatus(filter);

  return (
    <Card>
      <CardHeader>
        <FilterStatusBadge status={status} />
        <CardTitle>{filter.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <FilterDetails filter={filter} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onReplace(filter)}>Replace</Button>
        <Button variant="outline" onClick={() => onEdit(filter)}>Edit</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### Pattern 4: Protected Routes

**Problem:** Restrict access to authenticated users

**Solution:** Route guards with redirection

```typescript
// auth-guard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Usage in routes
<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  }
/>
```

---

## Module Dependencies

```
┌──────────────────────────────────────────────────────────────────────┐
│                              Pages                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Dashboard│  │ Purifiers│  │  Auth    │  │ Settings │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼─────────────┼─────────────┼────────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          Components                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Layout   │  │ Purifier │  │  Filter  │  │   Auth   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼─────────────┼─────────────┼────────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                            Hooks                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ usePurifiers │  │  useFilters  │  │   useAuth    │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼─────────────────┼─────────────────┼────────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          Services                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │PurifierService│  │ FilterService │  │  AuthService  │            │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘            │
└──────────┼──────────────────┼──────────────────┼─────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        Firebase SDK                                   │
│           ┌──────────────┐       ┌──────────────┐                    │
│           │  Firestore   │       │     Auth     │                    │
│           └──────────────┘       └──────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Dependency Rules

1. **Pages** depend on Components and Hooks
2. **Components** depend on Hooks and UI components
3. **Hooks** depend on Services and Contexts
4. **Services** depend only on Firebase SDK
5. **No circular dependencies allowed**

---

## Error Handling Strategy

### Error Types

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields: Record<string, string>) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Service │───▶│ Throw Error  │───▶│    Hook     │───▶│  Component   │
│  Error   │    │              │    │ Catch/State │    │ Display Toast│
└──────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### Error Boundary

```typescript
// components/error-boundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error) => {
        console.error('Unhandled error:', error);
        // Could send to error tracking service
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

---

## Security Architecture

### Authentication

- **Method:** Firebase Authentication (Email/Password)
- **Session:** Managed by Firebase SDK (persistent by default)
- **Token:** JWT handled automatically by Firebase

### Authorization

- **Model:** User-based data isolation
- **Implementation:** Firestore Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check ownership
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Purifier Types - read by all auth users, write only own custom types
    match /purifierTypes/{typeId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.isCustom == true;
      allow update, delete: if isAuthenticated()
        && resource.data.userId == request.auth.uid;
    }

    // Purifiers - full access to own data only
    match /purifiers/{purifierId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated()
        && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);

      // Filters subcollection
      match /filters/{filterId} {
        allow read, write: if isAuthenticated()
          && get(/databases/$(database)/documents/purifiers/$(purifierId)).data.userId == request.auth.uid;
      }
    }

    // Filter Replacements
    match /filterReplacements/{replacementId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated()
        && request.resource.data.userId == request.auth.uid;
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

---

## Performance Considerations

### Optimization Techniques

1. **Code Splitting**
   - Lazy load routes
   - Dynamic imports for large components

```typescript
// Lazy loaded routes
const DashboardPage = lazy(() => import('./pages/dashboard'));
const PurifierDetailPage = lazy(() => import('./pages/purifiers/[id]'));
```

2. **Firestore Query Optimization**
   - Use compound queries where needed
   - Limit query results
   - Use real-time listeners efficiently

```typescript
// Efficient query with limit
const q = query(
  collection(db, 'purifiers'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

3. **Memoization**
   - Memoize expensive status calculations
   - Use `useMemo` for derived data

```typescript
const filtersNeedingAttention = useMemo(() => {
  return filters.filter(f =>
    filterStatusService.calculateStatus(f) !== 'ok'
  );
}, [filters]);
```

4. **Bundle Optimization**
   - Tree shaking (enabled by Vite)
   - Only import needed Firebase modules

```typescript
// Import only needed Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

---

## Deployment Architecture

### Static Hosting

```
┌─────────────────┐     ┌──────────────────────┐
│   Developer     │     │   Static Hosting     │
│   (npm build)   │────▶│   (Firebase/Vercel)  │
└─────────────────┘     └──────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────┐
│                   CDN                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Edge 1  │  │ Edge 2  │  │ Edge N  │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
                    │
                    ▼
              ┌──────────┐
              │  Users   │
              └──────────┘
```

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },
});
```

### Environment Variables

```bash
# .env.local (not committed)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

## File Structure Summary

```
water-purifier-manager/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── auth/             # Auth components
│   │   ├── purifier/         # Purifier components
│   │   ├── filter/           # Filter components
│   │   └── dashboard/        # Dashboard components
│   ├── contexts/
│   │   ├── auth-context.tsx
│   │   └── notification-context.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-purifiers.ts
│   │   ├── use-purifier.ts
│   │   ├── use-filters.ts
│   │   └── use-purifier-types.ts
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth-service.ts
│   │   ├── purifier-service.ts
│   │   ├── filter-service.ts
│   │   ├── purifier-type-service.ts
│   │   └── filter-status-service.ts
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── purifiers/
│   │   └── settings/
│   ├── types/
│   │   ├── index.ts
│   │   ├── purifier.ts
│   │   ├── filter.ts
│   │   └── errors.ts
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── config/
│   │   └── firebase.ts       # Firebase config
│   ├── data/
│   │   └── purifier-types.ts # Default purifier types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONVENTIONS.md
│   └── REQUIREMENTS.md
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── components.json           # shadcn/ui config
└── CLAUDE.md
```

---

## Internationalization Architecture

### Overview

The application supports English (en) and Vietnamese (vi) languages using a hybrid approach:

1. **UI Text**: react-i18next with JSON translation files
2. **Purifier Types**: Bilingual data hardcoded with localization helpers
3. **Date Formatting**: date-fns with locale support

### i18n Structure

```
src/i18n/
├── index.ts           # i18n configuration
└── locales/
    ├── en.json        # English translations
    └── vi.json        # Vietnamese translations
```

### Translation Approach

```typescript
// UI text uses react-i18next
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<h1>{t('purifier.title')}</h1>

// Purifier types use custom hook with bilingual data
import { usePurifierTypes } from '@/hooks/use-purifier-types';
const { purifierTypes, getPurifierTypeById } = usePurifierTypes();
// Automatically returns localized names/descriptions based on current language
```

### Bilingual Data Structure (purifier-types.ts)

```typescript
interface DefaultPurifierType {
  id: string;
  name: { en: string; vi: string };
  filterTemplates: Array<{
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    // ...
  }>;
}

// Helper functions
getLocalizedPurifierTypes(lang: 'en' | 'vi')
getLocalizedPurifierTypeById(id: string, lang: 'en' | 'vi')
```

### Language Detection & Persistence

1. Check localStorage for saved preference
2. Fall back to browser language
3. Default to English if unsupported

---

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|-------------------------|
| 2025-01-07 | Use Firebase Firestore | No backend needed, real-time sync, offline support | Supabase, PocketBase |
| 2025-01-07 | Use shadcn/ui | Accessible, customizable, Tailwind-based | Material UI, Chakra UI |
| 2025-01-07 | Filters as subcollection | Easier to query per purifier | Flat collection with purifierId |
| 2025-01-07 | React Context over Redux | Simpler for this scope | Redux, Zustand |
| 2025-01-07 | Client-side only | Reduces complexity, Firebase handles security | Node.js backend |
| 2025-01-07 | Bilingual data for purifier types | Easier to modify, no i18n complexity for data | All data in i18n JSON files |
| 2025-01-07 | react-i18next for UI | Industry standard, good React integration | i18next, FormatJS |

---

## Glossary

| Term | Definition |
|------|------------|
| SPA | Single Page Application |
| Firestore | Firebase's NoSQL document database |
| Subcollection | A collection nested within a document in Firestore |
| Security Rules | Server-side rules that validate Firestore operations |
| Real-time Listener | Firestore subscription that pushes updates to clients |
