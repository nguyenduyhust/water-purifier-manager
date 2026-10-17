# Data Protection

**Last Updated**: 2026-10-17

## Personal data stored

| Data | Where | Visible to |
|------|-------|-----------|
| Email, display name, sign-in providers | Firebase Auth | Only Firebase / project owners |
| Purifier names, locations, notes, filter history | `purifiers`, `filters`, `logs` | Owner and members of that purifier |
| Owner's display name | `purifiers.ownerName` | Members |
| Member's name and email | `purifiers.memberProfiles` | Owner and other members of that purifier |
| Invitee email (email invites) | `invites.email` | Creator, the invitee, anyone holding the invite id |
| Actor names | `logs.actorName` | Owner and members |

Users choose what to share: names and emails become visible to people they invite or are invited by. Locations and notes are free text — users may enter addresses.

## Data on devices

- **Web**: Firebase Auth session in IndexedDB; language preference and a post-sign-in return path (`returnTo`) in `localStorage`/`sessionStorage`. No other personal data in browser storage.
- **iOS**: Firebase Auth session in the Keychain; Firestore's on-device cache; scheduled notifications contain filter and purifier names.

## Deletion

- Deleting a purifier deletes its filters, history and invites.
- Leaving a purifier removes the member's profile from it; their name remains in history entries they created.
- Account deletion isn't offered in the apps yet (App Store requires it for apps with account creation before public release).

## Secrets and configuration

| Item | Policy |
|------|--------|
| `web/.env.local` | Git-ignored. Contains the Firebase web config (identifies the project; not a secret on its own) |
| `GoogleService-Info.plist` | Git-ignored anywhere in the repo |
| `ios/Config/Firebase.xcconfig` | Git-ignored (`.example` committed) |
| `web/.env.emulator` | Committed; demo values only |
| Service-account keys, Apple keys (`.p8`) | Never stored in the repo; none are used today |
| Firebase CLI login | On the developer's machine; used by deploys and migration scripts |

Review staged files before every commit (`git status`); see [incident response](../07-operations/incident-response.md#secrets-committed-by-mistake) if something slips through.

## Related

- Access control → [access-control.md](access-control.md)
