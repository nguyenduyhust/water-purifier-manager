# Backup and Restore

**Last Updated**: 2026-10-17

## Current state

**No backups are configured.** Firestore replicates data for durability, but nothing protects against a bad write, a buggy migration or an accidental deletion. Deleting a purifier deletes its filters, history and invites permanently.

Mitigations in place:
- Migration scripts never overwrite or delete source data and can roll back their own writes ([data-migrations.md](data-migrations.md)).
- The legacy `activityLogs` collection is kept after migration.

## Recommended

| Option | Notes |
|--------|-------|
| Firestore point-in-time recovery (PITR) | Read any version from the last 7 days; requires the Blaze plan |
| Scheduled managed exports to Cloud Storage | `gcloud firestore export gs://…` on a schedule; requires Blaze and a bucket |
| Manual export before risky operations | `gcloud firestore export` as a project owner |

Restoring from an export is `gcloud firestore import`, which overwrites documents with the same paths — rehearse on a separate project first.

## Related

- Incidents → [incident-response.md](incident-response.md)
