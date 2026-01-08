# Coding Conventions

> This document defines the coding standards and conventions for this project.
> Following these conventions ensures consistency and helps Claude Code understand the codebase.

## Table of Contents

- [General Principles](#general-principles)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Code Style](#code-style)
- [TypeScript Guidelines](#typescript-guidelines)
- [Error Handling](#error-handling)
- [Comments & Documentation](#comments--documentation)
- [Testing Conventions](#testing-conventions)
- [Git Conventions](#git-conventions)

---

## General Principles

### DRY (Don't Repeat Yourself)
- Extract common logic into reusable functions
- Use shared utilities for cross-cutting concerns
- But don't over-abstract prematurely

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions over clever ones
- Code should be readable without extensive comments
- Avoid unnecessary complexity

### YAGNI (You Aren't Gonna Need It)
- Don't add functionality until it's needed
- Avoid speculative generalization
- Build for current requirements

### Single Responsibility
- Each function/class should do one thing well
- Keep functions under 50 lines when possible
- Split large files into logical modules

---

## Naming Conventions

### Variables & Functions

```typescript
// camelCase for variables and functions
const userName = 'John';
const isActive = true;
function getUserById(id: string) { }
const calculateTotal = (items: Item[]) => { };

// Booleans: use is/has/can/should prefixes
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldRefresh = false;

// Arrays: use plural names
const users = [];
const itemIds = [];

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
```

### Classes & Types

```typescript
// PascalCase for classes, interfaces, types, enums
class UserService { }
interface UserProfile { }
type UserId = string;
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Interfaces: don't use I prefix (TypeScript convention)
// Good
interface User { }
// Avoid
interface IUser { }

// Type vs Interface: Use interface for objects, type for unions/primitives
interface Config {
  apiUrl: string;
}
type Status = 'pending' | 'active' | 'completed';
```

### Files & Directories

```typescript
// kebab-case for files
user-service.ts
api-client.ts
use-auth-hook.ts

// Files should match their primary export
// user-service.ts exports UserService
// use-auth-hook.ts exports useAuthHook

// Index files for directory exports
src/
  services/
    user-service.ts
    auth-service.ts
    index.ts  // Re-exports all services
```

### React Components (if applicable)

```typescript
// PascalCase for components
function UserProfile() { }
const LoginForm: React.FC = () => { };

// Component files match component name
UserProfile.tsx
LoginForm.tsx

// Props interfaces
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}
```

---

## File Organization

### Import Order

```typescript
// 1. Node built-in modules
import path from 'path';
import fs from 'fs';

// 2. External dependencies (npm packages)
import express from 'express';
import { z } from 'zod';

// 3. Internal modules (absolute imports)
import { UserService } from '@/services/user-service';
import { config } from '@/config';

// 4. Relative imports
import { helper } from './helper';
import { localUtil } from '../utils';

// 5. Type imports
import type { User, Config } from '@/types';

// 6. Style imports (if applicable)
import './styles.css';
```

### File Structure

```typescript
// Recommended order within a file:

// 1. Imports (as above)

// 2. Type definitions
interface Props { }
type State = { };

// 3. Constants
const DEFAULT_VALUE = 10;

// 4. Helper functions (if small and file-specific)
function helperFn() { }

// 5. Main export (class/function/component)
export function MainComponent() { }

// 6. Additional exports
export { helperFn };
```

### Directory Structure

```
src/
├── components/          # React components
│   ├── ui/              # Generic UI components
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── services/            # Business logic & API calls
├── utils/               # Pure utility functions
├── types/               # TypeScript type definitions
├── config/              # Configuration
├── constants/           # App-wide constants
└── lib/                 # Third-party library wrappers
```

---

## Code Style

### Functions

```typescript
// Prefer arrow functions for callbacks
users.map((user) => user.name);

// Use regular functions for hoisted declarations
function processUser(user: User): ProcessedUser {
  // ...
}

// Early returns for guard clauses
function getUser(id: string): User | null {
  if (!id) return null;
  if (!isValidId(id)) return null;

  // Main logic here
  return user;
}

// Limit function parameters (max 3, use object for more)
// Bad
function createUser(name: string, email: string, age: number, role: string, dept: string) { }

// Good
function createUser(params: CreateUserParams) { }
```

### Objects & Arrays

```typescript
// Trailing commas
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// Destructuring
const { name, email } = user;
const [first, ...rest] = items;

// Spread for immutable updates
const updatedUser = { ...user, name: 'New Name' };
const newItems = [...items, newItem];

// Object shorthand
const name = 'John';
const user = { name }; // Instead of { name: name }
```

### Async/Await

```typescript
// Prefer async/await over .then()
// Good
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Avoid
function fetchUser(id: string): Promise<User> {
  return api.get(`/users/${id}`).then(response => response.data);
}

// Handle errors with try/catch
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    return null;
  }
}
```

---

## TypeScript Guidelines

### Strict Mode

Always use strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Safety

```typescript
// Avoid 'any' - use 'unknown' if type is truly unknown
// Bad
function process(data: any) { }

// Good
function process(data: unknown) {
  if (isUser(data)) {
    // data is now typed as User
  }
}

// Use type guards
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}

// Prefer type inference when obvious
const name = 'John'; // string inferred
const count = 0;     // number inferred

// Explicit types for function returns
function getUser(id: string): User | null { }

// Use const assertions for literals
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'user' | 'guest'
```

### Generics

```typescript
// Use meaningful generic names
// Bad
function wrap<T>(value: T): { value: T } { }

// Better
function wrap<TValue>(value: TValue): { value: TValue } { }

// Constrain generics when needed
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

## Error Handling

### Error Types

```typescript
// Define custom error classes
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(message: string, public fields: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Patterns

```typescript
// Throw specific errors
function getUser(id: string): User {
  const user = db.findUser(id);
  if (!user) {
    throw new NotFoundError('User', id);
  }
  return user;
}

// Catch and handle appropriately
try {
  const user = await getUser(id);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Handle not found
  } else if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Unexpected error - log and rethrow
    logger.error('Unexpected error', error);
    throw error;
  }
}

// Use Result type for expected failures (optional pattern)
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function parseConfig(raw: string): Result<Config> {
  try {
    return { success: true, data: JSON.parse(raw) };
  } catch {
    return { success: false, error: new Error('Invalid JSON') };
  }
}
```

---

## Comments & Documentation

### When to Comment

```typescript
// DO: Explain WHY, not WHAT
// This timeout is needed because the API has a known race condition
// that causes duplicate requests if we don't wait
await delay(100);

// DON'T: Explain obvious code
// Get the user name (unnecessary)
const userName = user.name;

// DO: Document public APIs with JSDoc
/**
 * Fetches a user by their ID.
 *
 * @param id - The unique user identifier
 * @returns The user object or null if not found
 * @throws {ValidationError} If the ID format is invalid
 *
 * @example
 * const user = await fetchUser('123');
 * if (user) {
 *   console.log(user.name);
 * }
 */
async function fetchUser(id: string): Promise<User | null> { }

// DO: Mark TODOs with context
// TODO(username): Refactor this when we upgrade to v2 API
// FIXME: This breaks when user has no email
// HACK: Workaround for library bug #123
```

### Documentation Standards

```typescript
// Document interfaces/types
/** Represents a user in the system */
interface User {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Email address (must be unique) */
  email: string;
  /** Account creation timestamp */
  createdAt: Date;
}

// Document complex functions
/**
 * Processes a batch of items with rate limiting.
 *
 * @param items - Items to process
 * @param options - Processing options
 * @param options.batchSize - Number of items per batch (default: 10)
 * @param options.delayMs - Delay between batches in ms (default: 1000)
 * @returns Processed items with status
 */
async function processBatch<T>(
  items: T[],
  options?: { batchSize?: number; delayMs?: number }
): Promise<ProcessResult<T>[]> { }
```

---

## Testing Conventions

### Test File Organization

```
tests/
├── unit/                # Unit tests
│   └── services/
│       └── user-service.test.ts
├── integration/         # Integration tests
│   └── api/
│       └── users.test.ts
└── e2e/                 # End-to-end tests
    └── flows/
        └── login.test.ts

# Or co-located with source
src/
└── services/
    ├── user-service.ts
    └── user-service.test.ts
```

### Test Structure

```typescript
// Use describe blocks for organization
describe('UserService', () => {
  describe('getUser', () => {
    it('returns user when found', async () => {
      // Arrange
      const mockUser = { id: '1', name: 'John' };
      db.findUser.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUser('1');

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('throws NotFoundError when user does not exist', async () => {
      // Arrange
      db.findUser.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUser('999'))
        .rejects.toThrow(NotFoundError);
    });
  });
});

// Test naming: should [expected behavior] when [condition]
it('should return empty array when no users exist', () => { });
it('should throw ValidationError when email is invalid', () => { });
```

### Testing Best Practices

```typescript
// Use factories for test data
const createUser = (overrides?: Partial<User>): User => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

// Don't test implementation details
// Bad: Testing internal state
expect(service._cache.size).toBe(1);

// Good: Testing behavior
expect(await service.getUser('1')).toEqual(user);

// Use proper assertions
expect(result).toEqual(expected);     // Deep equality
expect(result).toBe(expected);        // Reference equality
expect(result).toContain(item);       // Array/string contains
expect(fn).toHaveBeenCalledWith(arg); // Mock calls
```

---

## Git Conventions

### Branch Naming

```bash
# Feature branches
feature/user-authentication
feature/add-payment-gateway

# Bug fixes
fix/login-redirect-loop
fix/null-pointer-exception

# Hotfixes
hotfix/security-vulnerability

# Chores/maintenance
chore/update-dependencies
chore/cleanup-unused-code

# Documentation
docs/api-documentation
```

### Commit Messages

```bash
# Format
<type>(<scope>): <subject>

<body>

<footer>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, semicolons, etc)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks
perf:     Performance improvements
ci:       CI/CD changes

# Examples
feat(auth): add JWT refresh token support

Implement automatic token refresh when access token expires.
Tokens are refreshed 5 minutes before expiration.

Closes #123

fix(api): handle null response from user endpoint

The API was returning null for deleted users, causing a crash.
Now returns a proper 404 response.

Fixes #456
```

### Pull Request Guidelines

1. Keep PRs focused and small (< 400 lines when possible)
2. Include description of changes
3. Link related issues
4. Add screenshots for UI changes
5. Ensure all tests pass
6. Request appropriate reviewers

---

## Linting & Formatting

### ESLint Configuration

Use consistent ESLint rules across the project. Key rules:

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "eqeqeq": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Performance Guidelines

1. **Avoid premature optimization** - Profile first
2. **Memoize expensive computations** - Use `useMemo`, `useCallback` appropriately
3. **Lazy load** - Split code and load on demand
4. **Batch updates** - Minimize re-renders and API calls
5. **Use appropriate data structures** - Map for lookups, Set for uniqueness

---

## React Component Conventions

### Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePurifiers } from '@/hooks/use-purifiers';
import type { Purifier } from '@/types';

// 2. Props interface (if needed)
interface PurifierCardProps {
  purifier: Purifier;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// 3. Component definition
export function PurifierCard({ purifier, onEdit, onDelete }: PurifierCardProps) {
  // 3a. Hooks (always at the top)
  const [isLoading, setIsLoading] = useState(false);
  const { deletePurifier } = usePurifiers();

  // 3b. Derived state / memoized values
  const filterCount = purifier.filters?.length ?? 0;

  // 3c. Event handlers
  const handleDelete = async () => {
    setIsLoading(true);
    await deletePurifier(purifier.id);
    onDelete?.(purifier.id);
  };

  // 3d. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Hook Conventions

```typescript
// Custom hooks start with "use"
// Return object for multiple values, single value for simple hooks

// Good - object return for multiple values
export function usePurifiers() {
  const [purifiers, setPurifiers] = useState<Purifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... implementation

  return { purifiers, loading, error, addPurifier, updatePurifier, deletePurifier };
}

// Good - single value for simple hooks
export function useFilterStatus(filter: Filter): FilterStatus {
  return useMemo(() => calculateStatus(filter), [filter]);
}
```

### Event Handler Naming

```typescript
// Use "handle" prefix for component event handlers
const handleClick = () => {};
const handleSubmit = (data: FormData) => {};
const handleFilterReplace = (filterId: string) => {};

// Use "on" prefix for props that receive handlers
interface Props {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  onFilterReplace?: (filterId: string) => void;
}
```

### Conditional Rendering

```typescript
// Early return for loading/error states
function PurifierList() {
  const { purifiers, loading, error } = usePurifiers();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (purifiers.length === 0) return <EmptyState />;

  return (
    <div>
      {purifiers.map((p) => (
        <PurifierCard key={p.id} purifier={p} />
      ))}
    </div>
  );
}

// Use && for simple conditionals
{isAdmin && <AdminPanel />}

// Use ternary for either/or
{isLoggedIn ? <Dashboard /> : <LoginPrompt />}
```

---

## Firebase/Firestore Conventions

### Service Layer Pattern

```typescript
// services/purifier-service.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Purifier, CreatePurifierData } from '@/types';

export const purifierService = {
  // Read operations
  async getAll(userId: string): Promise<Purifier[]> {
    const q = query(
      collection(db, 'purifiers'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purifier[];
  },

  // Real-time subscription
  subscribeToAll(
    userId: string,
    callback: (purifiers: Purifier[]) => void
  ): () => void {
    const q = query(
      collection(db, 'purifiers'),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const purifiers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Purifier[];
      callback(purifiers);
    });
  },

  // Write operations
  async create(data: CreatePurifierData): Promise<string> {
    const docRef = await addDoc(collection(db, 'purifiers'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Purifier>): Promise<void> {
    await updateDoc(doc(db, 'purifiers', id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'purifiers', id));
  },
};
```

### Timestamp Handling

```typescript
// Always use Firestore Timestamp for dates
import { Timestamp } from 'firebase/firestore';

// When creating documents
const data = {
  createdAt: Timestamp.now(),
  installationDate: Timestamp.fromDate(new Date(installationDate)),
};

// When reading documents (convert to Date for UI)
const createdAt = (doc.data().createdAt as Timestamp).toDate();

// Type definition
interface Purifier {
  id: string;
  createdAt: Timestamp;
  installationDate: Timestamp;
  // ... other fields
}
```

### Error Handling in Services

```typescript
import { FirebaseError } from 'firebase/app';

export async function createPurifier(data: CreatePurifierData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'purifiers'), data);
    return docRef.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'permission-denied':
          throw new Error('You do not have permission to create purifiers');
        case 'unavailable':
          throw new Error('Service temporarily unavailable. Please try again.');
        default:
          throw new Error('Failed to create purifier');
      }
    }
    throw error;
  }
}
```

---

## shadcn/ui Component Usage

### Import Convention

```typescript
// Import from @/components/ui/
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
```

### Form Pattern with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  location: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PurifierForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Kitchen Purifier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
```

### Dialog Pattern

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Tailwind CSS Conventions

### Class Order

Follow this order for Tailwind classes (enforced by Prettier plugin):

1. Layout (display, position, grid, flex)
2. Sizing (width, height, padding, margin)
3. Typography (font, text, leading)
4. Visual (background, border, shadow)
5. Interactive (hover, focus, active)

```typescript
// Good - ordered classes
<div className="flex items-center justify-between p-4 text-sm font-medium bg-white border rounded-lg hover:bg-gray-50">

// Avoid - unordered classes
<div className="hover:bg-gray-50 flex bg-white p-4 border text-sm rounded-lg items-center font-medium justify-between">
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Common breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
```

### Custom Colors

```typescript
// Use CSS variables defined in globals.css
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-destructive text-destructive-foreground">
```
