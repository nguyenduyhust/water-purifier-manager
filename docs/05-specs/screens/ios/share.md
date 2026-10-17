# I-09 · Share

| | |
|---|---|
| **Entry** | Sheet from I-06 › ⋯ › Share |
| **Auth** | Owner only |
| **File** | `ShareView` in `Features/Sharing/SharingViews.swift` |

**Overview**: Create invites, share their links with the system share sheet, and manage members.

## Layout

```
               Share                     Done
INVITE SOMEONE
 Email (optional)
 Role                          Editor ▾
 🔗 Create invite link
 ⬆ Send invite link                         after creating: system share sheet
 ⧉ Copy link
 Can edit details and replace filters. With an email, only that person can use
 the invite. Without one, anyone with the link can. Invites expire after 7 days.
PENDING INVITES
 🔗 Anyone with the link                    swipe: Revoke · long press: Send / Revoke
    Editor · Expires 24 Oct 2026
 ✉ carol@example.com
    Viewer · Expires 24 Oct 2026
PEOPLE WITH ACCESS
 Alice (you)  alice@example.com            Owner
 Bob          bob@example.com              Editor ▾     swipe: Remove (confirmation)
```

## Actions

| Element | Action |
|---------|--------|
| Create invite link | Creates the invite (email optional, validated) and reveals Send/Copy |
| Send invite link | System share sheet with `https://water-purifier-manager.vercel.app/invite/<id>` |
| Copy link | Copies the URL |
| Revoke | Deletes the invite |
| Role picker on a member | Changes their role |
| Remove | Confirmation, then removes the member |

## Related

- Requirement → [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-10](../web/share-dialog.md)
