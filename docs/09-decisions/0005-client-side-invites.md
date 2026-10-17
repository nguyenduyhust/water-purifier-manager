# 0005. Invites are Firestore documents whose id is the link secret

**Status**: Accepted
**Date**: 2026-10-17
**Deciders**: Project owner

---

## Context

Without a backend ([ADR-0001](0001-client-only-firebase.md)) the apps can't send email or look up a user by email. Owners still need a way to bring people in, and Vietnamese users mostly share links through Zalo or Messenger.

## Decision

An invite is a document in `invites` with a role, an optional email, a status and a 7-day expiry. The random document id is the secret in the link (`/invite/<id>`). Link invites can be accepted by anyone signed in who has the link; email invites only by a user whose verified token email matches. Accepting is one batch that adds the user to the purifier and marks the invite used; the purifier and invite rules each verify the other.

## Alternatives considered

- **Cloud Functions to send email and resolve users** — best experience, but needs the Blaze plan and a backend; deferred ([proposal 0001](../10-proposals/0001-send-invite-emails.md)).
- **Owner adds members by uid/email directly** — impossible client-side (no user lookup) and leaks account existence.
- **Reusable links** — convenient for groups, but a leaked link grants access indefinitely.

## Consequences

- **Positive**: works today with no backend; fits link-sharing habits; tightly verified by rules (37 tests).
- **Negative / cost**: owners must send links themselves; email invitees must be told to open the app; email/password users must verify their email first; Apple "Hide My Email" users can't match email invites.
- **Committed to**: single-use, 7-day invites; anyone with the id can read an invite's purifier name and inviter name.
- **Reversal cost**: adding email delivery later keeps the same documents.

## References

- [`../05-specs/database/invites.md`](../05-specs/database/invites.md)
- [`../08-security/access-control.md`](../08-security/access-control.md)
