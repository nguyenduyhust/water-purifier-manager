# Sharing Requirements

**Version**: 1.0.0
**Last Updated**: 2026-10-17

## Overview

A household often has one person who installs the purifier and others who replace filters. Sharing lets a purifier's owner invite people, each with a role: **editor** (edit details, replace filters) or **viewer** (read only). Sharing is per purifier, not per household ([ADR-0004](../../09-decisions/0004-share-per-purifier.md)). Invites work without a backend: by link, or bound to an email address ([ADR-0005](../../09-decisions/0005-client-side-invites.md)).

## Data Model Summary

- **Purifier** (`purifiers`): `userId` is the owner; `memberIds`, `roles`, `memberProfiles`, `ownerName`, `lastInviteId` describe sharing — [spec](../../05-specs/database/purifiers.md)
- **Invite** (`invites`): role, optional email, status, expiry; the document id is the secret in the link — [spec](../../05-specs/database/invites.md)
- **Log** (`purifiers/{id}/logs`): history visible to every member, with `actorId`/`actorName` — [spec](../../05-specs/database/logs.md)

## Requirements

### FR-009: Purifier sharing
- **Priority**: High
- **Status**: Done on web and iOS; Firestore rules and history migration deployed to production on 2026-10-17
- **Acceptance criteria**:
  - [x] The owner creates an invite with a role (editor or viewer); it works once and expires after 7 days
  - [x] Link invite: anyone signed in who opens the link can accept it
  - [x] Email invite: only a user signed in with that **verified** email can accept it; it appears on their dashboard
  - [x] The owner copies or shares pending invite links, and revokes them
  - [x] The owner changes a member's role and removes members
  - [x] A member can leave a shared purifier
  - [x] Shared purifiers appear in the member's purifier list, dashboard, history and iOS reminders, marked "Shared · <role>"
  - [x] Editors can edit name, location and notes and replace filters; viewers can't change anything
  - [x] Only the owner can delete the purifier or manage sharing
  - [x] History shows who did each action and is visible to every member, including history from before sharing existed (migrated)
  - [x] Members see who shared the purifier with them ("Shared by <owner>")
  - [x] A purifier can have at most 20 members

### Joining

| Platform | Link invite | Email invite |
|----------|-------------|--------------|
| Web | Open the link → sign in or sign up → back on the invite page → Accept | Dashboard › Invites for you › Accept / Decline |
| iOS | Purifiers › + › Join with invite link → paste the link → Accept invite | Dashboard › Invites for you › Accept / Decline |

Invite links point at the web app (`https://water-purifier-manager.vercel.app/invite/<id>`), so they work from any phone browser.

### Access matrix

| Action | Owner | Editor | Viewer | Invitee |
|--------|-------|--------|--------|---------|
| Read purifier, filters, history | ✅ | ✅ | ✅ | |
| Edit name, location, notes | ✅ | ✅ | | |
| Replace a filter (and log it) | ✅ | ✅ | | |
| Create/revoke invites, change roles, remove members | ✅ | | | |
| Delete the purifier | ✅ | | | |
| Leave | | ✅ | ✅ | |
| Accept a valid invite | | | | ✅ |
| Decline an email invite | | | | ✅ |

Enforced by [`firebase/firestore.rules`](../../../firebase/firestore.rules); see [access control](../../08-security/access-control.md).

## Out of scope

- Sending invite emails — needs a backend ([proposal 0001](../../10-proposals/0001-send-invite-emails.md))
- Opening invite links directly in the iOS app ([proposal 0002](../../10-proposals/0002-universal-links-for-invites.md))
- Per-member reminder settings, transferring ownership
- Apple "Hide My Email" relay addresses never match an email invite; use a link invite instead

---

**Related**: [README](README.md) · [Purifiers](purifiers.md) · [Reminders](reminders.md) · Screens: [web share dialog](../../05-specs/screens/web/share-dialog.md), [web invite](../../05-specs/screens/web/invite.md), [iOS share](../../05-specs/screens/ios/share.md), [iOS join invite](../../05-specs/screens/ios/join-invite.md) · [Sequence diagrams](../../03-architecture/diagrams/sequence.md) · [ADR-0006](../../09-decisions/0006-history-under-each-purifier.md)
