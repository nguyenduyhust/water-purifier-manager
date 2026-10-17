# I-01 · Sign in

| | |
|---|---|
| **Entry** | App launch while signed out |
| **File** | `Features/Auth/SignInView.swift` |

**Overview**: Email/password, Sign in with Apple and Google.

## Layout

```
Sign in
          [app logo]
   Water Purifier Manager
 Track filter replacements for
     your water purifiers
┌──────────────────────────────┐
│ Email                        │
│ Password                     │
└──────────────────────────────┘
 Forgot password?
┌──────────── Sign in ─────────┐   disabled until email + password
 Or continue with
[▇▇▇▇  Sign in with Apple  ▇▇▇▇]   black (white in dark mode)
[ G   Continue with Google     ]
┌ Don't have an account? Sign up ›┐
```

## Actions

| Element | Action |
|---------|--------|
| Sign in | Firebase email/password sign-in |
| Sign in with Apple | Apple authorization with nonce → Firebase; stores the name on first sign-in |
| Continue with Google | GoogleSignIn sheet → Firebase |
| Forgot password? | → I-03 |
| Sign up | → I-02 |

Errors appear in an alert with a translated message; cancelling Apple or Google shows nothing.

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
- Integrations → [Google Sign-In](../../integrations/google-sign-in.md), [Sign in with Apple](../../integrations/sign-in-with-apple.md)
