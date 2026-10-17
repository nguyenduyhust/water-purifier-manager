# W-11 · Accept invite

| | |
|---|---|
| **Route** | `/invite/:inviteId` |
| **Auth** | Required — signed-out visitors go to W-01 and come back here |
| **File** | `pages/invite/index.tsx` |

**Overview**: The page an invite link opens. Shows who invited the user to which purifier and with which role, explains any problem, and lets them accept.

## Layout

```
┌──────────────────────────────────────────┐
│ (👥)                                     │
│ Purifier invite                          │
│ Alice invited you to "Kitchen purifier". │
│                                          │
│ You will join as Editor: can edit        │
│ details and replace filters.             │
│                                          │
│ [Accept]  [Cancel | Decline]             │
└──────────────────────────────────────────┘
```

"Decline" appears for email invites; link invites show "Cancel" (a link invite can't be declined, only left unused).

## States

| Condition | Message | Button |
|-----------|---------|--------|
| Valid | "You will join as <role>: …" | Accept, Cancel/Decline |
| Not found or revoked | "This invite doesn't exist or was revoked." | Back to dashboard |
| Expired | "This invite has expired. Ask the owner for a new one." | Back to dashboard |
| Already used / declined | "…already been used." / "…was declined." | Back to dashboard |
| Email invite, different email | "This invite was sent to <email>. Sign in with that email to accept it." | Back to dashboard |
| Email not verified | "Verify your email address before accepting this invite." | Back to dashboard |
| Own purifier | "This is your own purifier." | Open purifier |
| Already a member | "You already have access to this purifier." | Open purifier |

## Actions

| Element | Action |
|---------|--------|
| Accept | Batch: join the purifier + mark the invite accepted; toast; → W-07 |
| Decline | Marks the email invite declined; → W-04 |

## Related

- Requirement → [FR-009](../../../02-requirements/functional/sharing.md)
- Sequence → [invite and accept](../../../03-architecture/diagrams/sequence.md#invite-and-accept)
- iOS equivalent → [I-10](../ios/join-invite.md)
