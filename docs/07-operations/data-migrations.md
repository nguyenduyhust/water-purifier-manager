# Data Migrations

**Last Updated**: 2026-10-17

Changes to existing production data are done with scripts in `firebase/scripts/`, never by hand in the console.

## Rules for migration scripts

1. **Audit by default.** Running without flags only reads and prints a report (counts and ids, no personal data). Writing needs `--apply`.
2. **Never overwrite.** Create documents with a `currentDocument: { exists: false }` precondition.
3. **Never delete source data** in the same step; old clients may still read it.
4. **Idempotent.** Re-running must be safe (keep source ids, skip what exists).
5. **Reversible.** Mark created documents (e.g. `migratedFrom`) and provide `--rollback`.
6. **Rehearse on the emulators** with `--emulator` before production: audit → apply → re-run (no-op) → overwrite rejected → rollback → re-apply, and check the apps show the result correctly.
7. **Verify afterwards** with a fresh audit and a field-by-field comparison.

Scripts authenticate as the Firebase CLI's logged-in account (`npx firebase-tools login`), which uses IAM permissions and bypasses security rules. They do not touch Application Default Credentials.

## Runbook: legacy history → per-purifier logs

`firebase/scripts/migrate-activity-logs.mjs` copies `activityLogs` into `purifiers/{purifierId}/logs` so members of shared purifiers see the full history ([ADR-0006](../09-decisions/0006-history-under-each-purifier.md)).

```bash
cd firebase
node scripts/migrate-activity-logs.mjs                    # audit (production)
node scripts/migrate-activity-logs.mjs --apply            # copy
node scripts/migrate-activity-logs.mjs --rollback         # list copies made by this script
node scripts/migrate-activity-logs.mjs --rollback --apply # delete those copies only
# add --emulator to any of the above for the local emulators
```

The audit classifies every legacy entry: to migrate, already migrated, purifier deleted, owner mismatch, missing fields, unknown type. Copies get `actorId` = the entry's `userId`, `actorName` = the owner's display name (looked up via Identity Toolkit), `migratedFrom = activityLogs/<id>`.

### History

| Date | Action | Result |
|------|--------|--------|
| 2026-10-17 | Audit (production) | 11 entries (9 replacements, 2 creations), 2 purifiers, 2 owners; nothing to skip |
| 2026-10-17 | Rehearsal on emulators | Apply, no-op re-run, `ALREADY_EXISTS` on overwrite, rollback and re-apply all verified; web and iOS showed no duplicates |
| 2026-10-17 | `--apply` (production) | 11/11 copied; re-audit: 11 already migrated; field-by-field check: 11 match; `activityLogs` unchanged |
| Pending | Re-run after PR #3 is live and iOS build 3 is out | Picks up entries written by old clients in the meantime |

Clients de-duplicate history by id, so running the migration while old and new clients coexist is safe.

## Related

- Logs schema → [`../05-specs/database/logs.md`](../05-specs/database/logs.md)
- Retiring the legacy collection → [proposal 0003](../10-proposals/0003-retire-legacy-activity-logs.md)
