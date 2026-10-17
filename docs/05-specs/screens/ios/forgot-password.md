# I-03 · Reset password

| | |
|---|---|
| **Entry** | I-01 › Forgot password? (pre-fills the email typed there) |
| **File** | `Features/Auth/ForgotPasswordView.swift` |

**Overview**: Sends Firebase's password reset email.

## Layout

```
Reset password
┌ Email ───────────────────┐
 Enter your email and we'll send you a link to reset your password.
┌──── Send reset link ─────┐
        ↓ after sending
✉  Check your email
   We sent a password reset link to <email>
┌──── Back to sign in ─────┐
```

## Related

- Requirement → [FR-001](../../../02-requirements/functional/authentication.md)
