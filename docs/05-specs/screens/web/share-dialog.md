# W-10 · Share (dialog)

| | |
|---|---|
| **Opened from** | W-07, "Share" |
| **Auth** | Owner only |
| **File** | `components/sharing/share-dialog.tsx` |

**Overview**: The owner invites people and manages who has access.

## Layout

```
┌ Share "Kitchen purifier" ─────────────────────────────┐
│ Invite people to view or manage this purifier.        │
│ Invite someone                                        │
│ Email (optional) [name@example.com ]  Role [Editor ▾] │
│ Can edit details and replace filters. With an email,  │
│ only that person can use the invite…                  │
│ [🔗 Create invite link]                               │
│ ┌ Invite created ───────────────────────────────────┐ │
│ │ Copy the link and send it, e.g. via Zalo…         │ │
│ │ [https://…/invite/oFUlgf9o8RxWGSJGH7ZM ] [⧉]       │ │
│ └───────────────────────────────────────────────────┘ │
│ ───────────────────────────────────────────────────── │
│ Pending invites                                       │
│ 🔗 Anyone with the link · Editor · Expires 24 Oct [⧉][🗑]│
│ ✉ carol@example.com · Viewer · Expires 24 Oct     [⧉][🗑]│
│ ───────────────────────────────────────────────────── │
│ People with access                                    │
│ Alice (you)  alice@example.com              [Owner]   │
│ Bob          bob@example.com          [Editor ▾] [👤−] │
└───────────────────────────────────────────────────────┘
```

## Actions

| Element | Action |
|---------|--------|
| Create invite link | Creates an invite (role, optional email; email validated) and shows its link. Also stores the owner's name on the purifier |
| ⧉ (copy) | Copies the invite link |
| 🗑 (revoke) | Deletes the invite |
| Role select on a member | Changes their role immediately |
| 👤− | Confirm, then removes the member |

## Related

- Requirement → [FR-009](../../../02-requirements/functional/sharing.md)
- Collections → [invites](../../database/invites.md), [purifiers](../../database/purifiers.md)
- iOS equivalent → [I-09](../ios/share.md)
