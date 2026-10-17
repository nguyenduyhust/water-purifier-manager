# W-01 · Sign in

| | |
|---|---|
| **Route** | `/login` |
| **Auth** | Not required (signed-in users are redirected onward) |
| **Files** | `pages/auth/login.tsx`, `components/auth/login-form.tsx` |

**Overview**: Email/password and Google sign-in. If the user was sent here from a protected page (e.g. an invite link), they return to it after signing in.

## Layout

```
┌───────────────────────────────────────┐
│   [logo]  Water Purifier Manager      │
│ ┌───────────────────────────────────┐ │
│ │ Sign in                           │ │
│ │ Email     [                    ]  │ │
│ │ Password  [                    ]  │ │
│ │                 Forgot password?  │ │
│ │ [            Sign in            ] │ │
│ │ ───────── Or continue with ────── │ │
│ │ [ G  Google                     ] │ │
│ │ Don't have an account? Sign up    │ │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Sign in | Validates (email format, password ≥ 6), signs in, continues to the return path or `/` |
| Google | Popup sign-in; redirect sign-in inside in-app browsers |
| Forgot password? | → W-03 |
| Sign up | → W-02, keeping the return path |

Errors: invalid credentials, too many attempts, generic failure; closing the Google popup shows nothing.

## Known gaps

Most form text is hard-coded English rather than translated ([FR-008](../../../02-requirements/functional/i18n.md)).

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
- Auth flow → [`../../../03-architecture/auth.md`](../../../03-architecture/auth.md)
