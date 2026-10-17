# 08 · Security

**Last Updated**: 2026-10-17

The apps are clients talking straight to Firebase, so anything a user can do with the official app they can also do with their own script and their Firebase ID token. **Firestore security rules are the only thing standing between users and each other's data.** Everything else (hidden buttons, form validation) is convenience.

| Document | Contents |
|----------|----------|
| [access-control.md](access-control.md) | The Firestore rules, explained rule by rule |
| [data-protection.md](data-protection.md) | What personal data is stored, where, who can see it; secrets and config |
| [input-validation.md](input-validation.md) | What is validated on the client vs enforced by rules |

## Threat model

| Threat | Mitigation |
|--------|------------|
| Reading another user's purifiers, filters, history | Rules: read requires owner (`userId`) or member (`memberIds`) |
| Editing or deleting someone else's purifier | Rules: owner-only deletes; editors limited to name/location/notes and filter replacement fields |
| A viewer modifying data | Rules: viewers have no write path except leaving |
| Joining a purifier without an invite, or with a higher role | Accept is one batch; purifier and invite rules verify each other (pending, unexpired, matching purifier and role, email match + verified) |
| Reusing an invite after removal | Purifier rule requires the invite to be `pending` before the batch |
| Guessing invite links | Ids are random 20-character Firestore ids; invites can't be listed except by their creator or invited email |
| Enumerating invites sent to someone else's email | Listing requires `email == your verified token email` |
| Forging history ("by Bob") | Log `actorId` must equal the writer's uid; logs are immutable |
| Planting a member through purifier creation | Create requires no sharing fields |
| Leaking config/credentials via git | Client config files git-ignored; no service-account keys in the repo |
| Old app builds breaking or bypassing new rules | New rules keep accepting legacy owner queries; legacy logs stay owner-only |

Not covered: rate limiting/abuse (Firebase defaults only), App Check (not enabled), audit logging beyond the history entries.

## Verification

37 emulator tests cover allow and deny cases, including every invite attack above ([rules tests](../06-testing/rules.md)); new tests are mutation-checked.

## Related

- Rules source → [`firebase/firestore.rules`](../../firebase/firestore.rules)
- Incident handling → [`../07-operations/incident-response.md`](../07-operations/incident-response.md)
