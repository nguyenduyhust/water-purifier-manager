# 0001. Clients talk directly to Firebase

**Status**: Accepted
**Date**: 2025-01-07
**Deciders**: Project owner

---

## Context

The product is a household utility with small data volumes and no budget for running servers. It needs authentication, a database with realtime sync, and per-user data isolation.

## Decision

We build client-only apps that use Firebase Authentication and Cloud Firestore directly, and enforce all authorization in Firestore security rules. There is no app-owned backend.

## Alternatives considered

- **Node.js (or similar) API in front of a database** — full control, but servers to run, secure and pay for.
- **Supabase / PocketBase** — comparable, but Firestore's realtime listeners, offline cache and mature iOS SDK fit better.

## Consequences

- **Positive**: nothing to operate; realtime sync and offline (iOS) for free; fits the free tier.
- **Negative / cost**: rules become critical business logic and need thorough tests; no trusted environment for sending email, looking up users by email, scheduled jobs or server-side validation; logic shared by web and iOS is implemented twice.
- **Committed to**: Firebase as the backend; schema changes coordinated across both apps and the rules.
- **Reversal cost**: adding Cloud Functions later is incremental ([proposal 0001](../10-proposals/0001-send-invite-emails.md)); replacing Firebase would mean rewriting data access in both apps.

## References

- [`../01-overview/architecture.md`](../01-overview/architecture.md)
- [`../08-security/access-control.md`](../08-security/access-control.md)
