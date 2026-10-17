# 0006. History lives under each purifier

**Status**: Accepted
**Date**: 2026-10-17
**Deciders**: Project owner

---

## Context

History was a top-level `activityLogs` collection keyed by `userId`, readable only by its owner. With sharing, every member needs to see a purifier's history and who did each action. The first sharing release left old entries in place, so members couldn't see anything before sharing started; users asked for the full history.

## Decision

We store history in `purifiers/{id}/logs` with `actorId`/`actorName`, readable by everyone who can read the purifier. Legacy entries were copied there by an audited, idempotent migration that keeps the original ids. Clients still read `activityLogs` for their own entries and de-duplicate by id until no old clients remain.

## Alternatives considered

- **Keep `activityLogs` and add `memberIds` to each entry** — membership would have to be copied into every log and kept in sync when it changes.
- **Leave old history unmigrated** — simplest, rejected because members lose context.
- **Let each app migrate its owner's entries on launch** — no admin credentials needed, but duplicated in two apps and only runs when owners open the app.

## Consequences

- **Positive**: one rule (`canRead(parent)`) covers history; deleting a purifier deletes its history; members see everything.
- **Negative / cost**: history is fetched per purifier (N queries); a transition period with two locations and de-duplication.
- **Committed to**: logs are immutable; actor names are snapshots.
- **Reversal cost**: low; the legacy collection was not modified.

## References

- [`../05-specs/database/logs.md`](../05-specs/database/logs.md)
- [`../07-operations/data-migrations.md`](../07-operations/data-migrations.md)
- [proposal 0003](../10-proposals/0003-retire-legacy-activity-logs.md)
