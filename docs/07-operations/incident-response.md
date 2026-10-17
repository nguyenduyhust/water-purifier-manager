# Incident Response

**Last Updated**: 2026-10-17

There is no on-call rotation; the project owner handles incidents. Steps for the likely ones:

## Users get "permission denied" / features fail after a release

1. Check whether client code was released before matching rules: compare `firebase/firestore.rules` on `main` with Firebase console › Firestore › Rules.
2. Deploy the rules from `main` ([deployment](deployment.md#firestore-rules-and-indexes)) or roll the web back in Vercel.
3. If a query mentions a missing index, deploy indexes and wait for the build.

## Shared purifiers don't appear for members

- Index `purifiers (memberIds array-contains, createdAt desc)` missing or still building — `firestore:indexes` to check.
- Member is on an old app version (web cache or iOS build ≤ 2) that doesn't query shared purifiers — reload / update.

## A rules change broke something

Redeploy the previous rules version (git history or console rules history), then fix forward with a test reproducing the problem.

## Suspected data access by the wrong user

1. Review the rule involved and its tests; reproduce with a new rules test.
2. Check which invites exist for the purifier (owner can see them in Share); revoke unknown ones.
3. Remove unexpected members (owner: Share › remove).
4. Deploy the fixed rules.

## A migration wrote bad data

`node scripts/<migration>.mjs --rollback` (audit), then `--rollback --apply`. Source data is never modified by migrations.

## Accidental purifier deletion

Not recoverable without backups ([backup.md](backup.md)). The legacy `activityLogs` may still contain pre-sharing history for it.

## Secrets committed by mistake

Firebase client config is not a secret, but `GoogleService-Info.plist` and `.env.local` are kept out of git by policy. If one is committed: remove it in a follow-up commit; if it was pushed, also restrict the API key in Google Cloud › Credentials (allowed apps/referrers) and rotate it if needed. If an Apple or service-account key leaks, revoke it immediately in its console.

## Related

- Security → [`../08-security/`](../08-security/README.md)
