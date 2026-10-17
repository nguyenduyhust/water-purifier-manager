# 0003. Retire the legacy `activityLogs` collection

**Status**: Draft
**Date**: 2026-10-17
**Authors**: Project owner

---

## Summary

Once no released client writes to `activityLogs`, run the history migration a final time, stop reading the collection in both apps, and eventually delete it and its rules and index.

## Context

History moved to `purifiers/{id}/logs` ([ADR-0006](../09-decisions/0006-history-under-each-purifier.md)). Clients still read `activityLogs` and de-duplicate by id because the previous web deploy and iOS builds ≤ 2 write there. The extra query and de-duplication are only needed during the transition.

## Proposal

1. Wait until PR #3 is live on the web and iOS build 3+ has replaced older builds for all testers.
2. Run `node firebase/scripts/migrate-activity-logs.mjs` (audit, then `--apply`) to copy anything written meanwhile.
3. Remove the legacy query and de-duplication from `activity-log-service.ts` and `ActivityLogRepository.swift`.
4. Later: make `activityLogs` read-only in rules (drop create/update/delete), then export and delete it, remove its rules block and index.

## Alternatives considered

- **Keep reading it forever** — harmless but one extra query per history load and confusing code.

## Consequences

- **Positive**: simpler history code; one fewer index and rules block.
- **Negative / cost**: any very old client still writing would lose those entries from view (mitigated by the final migration run and the read-only step).

## Open questions

- [ ] How long to wait for old iOS builds (TestFlight builds expire after 90 days)?

## References

- [`../07-operations/data-migrations.md`](../07-operations/data-migrations.md)
