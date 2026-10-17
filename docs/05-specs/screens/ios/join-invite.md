# I-10 · Join a purifier

| | |
|---|---|
| **Entry** | Sheet from I-05 › + › Join with invite link |
| **File** | `JoinInviteView` in `Features/Sharing/SharingViews.swift` |

**Overview**: Invite links open the web app; on iOS the user pastes the link (or just its code) here. Universal links are not set up yet ([proposal 0002](../../../10-proposals/0002-universal-links-for-invites.md)).

## Layout

```
Cancel        Join a purifier
 Invite link   https://…/invite/…          (accessibility id: inviteLinkField)
 [Paste]                                    system PasteButton, no clipboard prompt
 Paste the invite link you received from the purifier's owner.
                ↓ once a valid link/code is entered
 Purifier      Kitchen purifier
 Invited by    Alice
 Role          Viewer
 Can only view                              or the problem, in red
┌──────── Accept invite ────────┐            only when there is no problem
```

Accepted input: a full link with `/invite/<id>` or a bare 10–40 character alphanumeric code. Problems shown are the same as on the web invite page ([W-11](../web/invite.md#states)), plus "This invite doesn't exist or was revoked."

## Actions

| Element | Action |
|---------|--------|
| Accept invite | Batch: join + mark accepted; closes; the purifier appears in I-05 as "Shared · <role>" |
| Cancel | Closes |

## Related

- Requirement → [FR-009](../../../02-requirements/functional/sharing.md)
- Web equivalent → [W-11](../web/invite.md)
