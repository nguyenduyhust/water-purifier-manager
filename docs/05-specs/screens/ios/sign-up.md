# I-02 · Sign up

| | |
|---|---|
| **Entry** | I-01 › Don't have an account? Sign up |
| **File** | `Features/Auth/SignUpView.swift` |

**Overview**: Create an email/password account.

## Layout

```
Sign up
┌──────────────────────────┐
│ Name                     │
│ Email                    │
├──────────────────────────┤
│ Password                 │
│ Confirm password         │
└──────────────────────────┘
 At least 6 characters  |  Passwords don't match (red)
┌──── Create account ──────┐   enabled when email set, password ≥ 6 and matching
```

## Actions

| Element | Action |
|---------|--------|
| Create account | Creates the account; sets the display name if a name was entered; the app switches to the tabs |

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
