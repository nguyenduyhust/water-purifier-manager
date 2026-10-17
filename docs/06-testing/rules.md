# Firestore Rules Tests

**Last Updated**: 2026-10-17

## What

`firebase/tests/firestore.rules.test.ts` loads `firebase/firestore.rules` into the Firestore emulator and checks reads and writes as different users with `@firebase/rules-unit-testing` and Vitest. 37 tests.

Fixture: `alice` owns purifier `p1`; `bob` is an editor, `carol` a viewer; `dave` and `erin` are outsiders. Invites: a link invite, an email invite for erin, an expired one and used ones. Plus a legacy purifier without sharing fields and a legacy activity log.

| Group | Examples |
|-------|----------|
| Purifiers: read | Owner and members read; outsiders can't; owner and shared queries allowed; querying someone else's purifiers denied; legacy purifiers readable |
| Purifiers: create/delete | Create only as owner with no members; only the owner deletes |
| Purifiers: editing | Editors change details only; viewers can't; owner changes roles and removes members; invalid roles or owner-as-member rejected |
| Leaving | A member removes themselves, not others |
| Accepting invites | Link and email invites work; wrong or unverified email, higher role, expired, used, reused-by-removed-member, joining without consuming, consuming without joining, owner joining own purifier — all rejected |
| Filters | Member reads (incl. legacy owner query); editors replace but can't rename; viewers can't; created with the purifier by the owner only; deleted by the owner only |
| Logs | Readable by members; written by editors under their own id only; not editable |
| Invites | Created by the owner within limits; readable by id; listed by creator and invited email only; declined by the invited email only; revoked by the creator |
| Legacy activityLogs | Readable by their owner only |

## Run

```bash
cd firebase
npm install
npm test        # firebase emulators:exec --only firestore --project demo-water-purifier "vitest run"
```

Needs Java 11+ (firebase-tools 13 is pinned for that reason).

## Writing a new test

1. Add allow and deny cases next to related ones; use `assertSucceeds` / `assertFails`.
2. **Mutation-check**: weaken the rule (e.g. replace a condition with `true`) and confirm at least one test fails. `assertFails` passes for *any* denial, so a test that never fails under mutation proves nothing. This is how the "removed member reuses an old invite" test was found to be missing.
3. Keep the fixture realistic: use the same field shapes the apps write.

## Related

- Rules explained → [`../08-security/access-control.md`](../08-security/access-control.md)
- Recipe → [`../04-development/recipes.md#add-a-firestore-rule`](../04-development/recipes.md#add-a-firestore-rule)
