# 0009. The owner stays in `userId`; owned and shared purifiers are queried separately

**Status**: Accepted
**Date**: 2026-10-17
**Deciders**: Project owner

---

## Context

Adding sharing meant clients must list purifiers they own *and* purifiers shared with them. Firestore can't express "`userId == me` OR `me in memberIds`" in one query. Existing purifiers had only `userId`, and released app builds query by `userId`.

## Decision

The owner remains in `userId` and is never added to `memberIds`. Clients run two listeners — `userId == me` and `memberIds array-contains me` — and merge the results. Rules accept both queries.

## Alternatives considered

- **A single `accessIds` array including the owner** — one query, but every existing purifier needs a migration before new clients can see it, and old clients' queries must keep working during rollout.

## Consequences

- **Positive**: no migration; old builds keep working for owners; the owner can't be "removed" by membership edits.
- **Negative / cost**: two listeners and a merge on each client; an extra composite index.
- **Committed to**: `memberIds` never contains the owner (enforced by `validMembership`).
- **Reversal cost**: moving to a single array later needs a migration.

## References

- [`../03-architecture/data-access.md`](../03-architecture/data-access.md)
