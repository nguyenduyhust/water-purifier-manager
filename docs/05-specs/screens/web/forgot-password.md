# W-03 · Forgot password

| | |
|---|---|
| **Route** | `/forgot-password` |
| **Auth** | Not required |
| **File** | `pages/auth/forgot-password.tsx` |

**Overview**: Sends Firebase's password reset email.

## Layout

```
[logo]  Water Purifier Manager
┌────────────────────────────────┐
│ Reset password                 │
│ Email  [                     ] │
│ [      Send reset link       ] │
│ ← Back to sign in              │
└────────────────────────────────┘
        ↓ after sending
┌────────────────────────────────┐
│ ✓ Check your email             │
│ We sent a reset link to <email>│
│ ← Back to sign in              │
└────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Send reset link | `sendPasswordResetEmail`; shows the confirmation state |
| Back to sign in | → W-01 |

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
