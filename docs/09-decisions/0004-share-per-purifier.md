# 0004. Share per purifier, with editor and viewer roles

**Status**: Accepted
**Date**: 2026-10-17
**Deciders**: Project owner

---

## Context

Families want several people to manage the same purifiers. An earlier plan in the requirements proposed "households": a group of users with purifiers assigned to it.

## Decision

We share each purifier individually. Its owner (`userId`) invites members, each with a role: **editor** (edit details, replace filters) or **viewer** (read only). Only the owner deletes the purifier or manages sharing.

## Alternatives considered

- **Households** — one setup covers every purifier, but adds a collection, rules that `get()` through it, and can't express "share only the purifier at my parents' house".
- **A single "manage" role** — simpler, but users asked for read-only access too.

## Consequences

- **Positive**: flexible per device; simple rules (membership lives on the purifier); no migration for existing purifiers.
- **Negative / cost**: sharing several purifiers means several invites (a "share all" shortcut could be added later).
- **Committed to**: `memberIds`/`roles`/`memberProfiles` on purifiers; owner never in `memberIds`; ≤ 20 members.
- **Reversal cost**: a household layer could be added on top later.

## References

- [`../02-requirements/functional/sharing.md`](../02-requirements/functional/sharing.md)
