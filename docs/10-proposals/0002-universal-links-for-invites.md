# 0002. Open invite links in the iOS app (universal links)

**Status**: Draft
**Date**: 2026-10-17
**Authors**: Project owner

---

## Summary

Make `https://water-purifier-manager.vercel.app/invite/<id>` open directly in the iOS app when it's installed, landing on the join screen with the invite loaded.

## Context

Invite links open the web app. iPhone users with the app must copy the link and paste it into Purifiers › + › Join with invite link ([I-10](../05-specs/screens/ios/join-invite.md)).

## Proposal

- Serve `/.well-known/apple-app-site-association` from the web app (`web/public/.well-known/`), listing `HH22B576H5.com.nguyenduyhust.waterpurifiermanager` for paths `/invite/*`; make sure Vercel serves it as JSON without a redirect.
- Add the Associated Domains entitlement `applinks:water-purifier-manager.vercel.app` (App ID capability enabled by automatic signing).
- Handle the URL in the app with `.onOpenURL` / `onContinueUserActivity`: parse with `InviteLink.inviteId(from:)` and present `JoinInviteView` pre-filled. If signed out, keep the invite id until sign-in completes.
- The web page stays as the fallback.

## Alternatives considered

- **Custom URL scheme** (`waterpurifier://invite/<id>`) — simpler, but links shared in chats wouldn't be tappable https links and would fail without the app.

## Consequences

- **Positive**: one tap from a Zalo message to the join screen.
- **Negative / cost**: depends on the Vercel domain; changing domains means updating the entitlement and AASA.

## Open questions

- [ ] Use a custom domain before shipping this, so the AASA host is stable?

## References

- [`../02-requirements/functional/sharing.md`](../02-requirements/functional/sharing.md)
