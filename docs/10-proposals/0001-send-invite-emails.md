# 0001. Send invite emails with Cloud Functions

**Status**: Draft
**Date**: 2026-10-17
**Authors**: Project owner

---

## Summary

When an owner creates an email invite, send the invitee an email with the invite link, so they don't have to be told separately to open the app.

## Context

Email invites work today ([ADR-0005](../09-decisions/0005-client-side-invites.md)) but nothing notifies the invitee: they only see the invite if they happen to sign in. The client can't send email without a backend. The user asked to defer Cloud Functions when sharing shipped.

## Proposal

- Enable the Blaze plan and add a Cloud Function triggered on `invites/{id}` create where `email != null`.
- The function sends a localized email (Vietnamese/English) with `https://water-purifier-manager.vercel.app/invite/<id>`, via the Firebase "Trigger Email" extension or a transactional email provider.
- Store `emailSentAt` on the invite for visibility in the Share dialog.
- No change to rules or clients beyond optional "Email sent" display.

## Alternatives considered

- **Keep link sharing only** — zero cost; relies on the owner messaging people.
- **mailto: link from the client** — opens the owner's mail app with the link prefilled; no backend, but clunky on web.

## Consequences

- **Positive**: email invites become self-contained.
- **Negative / cost**: billing account, a deployed function to maintain, email deliverability (SPF/DKIM), abuse limits (an owner could email arbitrary addresses).
- **Things we lock in**: a backend runtime, which also unlocks push reminders and user lookup.

## Open questions

- [ ] Which email provider, and from which domain?
- [ ] Rate limit per owner?
- [ ] Also notify the owner when an invite is accepted?

## References

- [`../02-requirements/functional/sharing.md`](../02-requirements/functional/sharing.md)
