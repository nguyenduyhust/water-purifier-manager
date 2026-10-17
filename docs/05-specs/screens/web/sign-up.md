# W-02 · Sign up

| | |
|---|---|
| **Route** | `/register` |
| **Auth** | Not required (signed-in users are redirected onward) |
| **Files** | `pages/auth/register.tsx`, `components/auth/register-form.tsx` |

**Overview**: Create an account with name, email and password, or continue with Google. Returns to the page the user came from (e.g. an invite).

## Layout

```
[logo]  Water Purifier Manager
┌────────────────────────────────┐
│ Create an account              │
│ Name              [          ] │
│ Email             [          ] │
│ Password          [          ] │
│ Confirm password  [          ] │
│ [        Create account      ] │
│ ──────── Or continue with ──── │
│ [ G  Google                  ] │
│ Already have an account? Sign in│
└────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Create account | Validates (name required, valid email, password ≥ 6, passwords match), creates the account, sets the display name, continues to the return path or `/` |
| Google | Same as W-01 |
| Sign in | → W-01, keeping the return path |

Errors: email already in use, invalid email, weak password, generic failure.

## Known gaps

Validation and error messages are hard-coded English.

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
