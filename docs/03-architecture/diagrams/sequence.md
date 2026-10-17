# Sequence Diagrams

**Last Updated**: 2026-10-17

The main write flows. "Client" is either app; both send the same writes.

## Create a purifier

```mermaid
sequenceDiagram
    actor O as Owner
    participant C as Client
    participant F as Firestore
    O->>C: name, model, installation date
    C->>C: look up model in shared/purifier-types.json
    C->>F: batch: set purifiers/{p} + set filters/{f1..fn} (lastReplacedAt = installation date)
    F-->>C: ok (rules: userId == me, no members, filters: getAfter(purifier).userId == me)
    C->>F: add purifiers/{p}/logs (purifier_created, actor = me)
    F-->>C: snapshots update lists everywhere
```

## Replace a filter

```mermaid
sequenceDiagram
    actor E as Owner or editor
    participant C as Client
    participant F as Firestore
    E->>C: date, notes
    C->>F: update filters/{f}: lastReplacedAt, updatedAt
    F-->>C: ok (rules: canEdit(parent), only those fields)
    C->>F: add logs: filter_replaced, actorId = me, actorName
    F-->>C: ok (rules: canEdit(parent), actorId == me)
    F-->>C: other members' listeners receive the new filter state
```

## Invite and accept

```mermaid
sequenceDiagram
    actor O as Owner
    participant CO as Owner's client
    participant F as Firestore
    participant CI as Invitee's client
    actor I as Invitee
    O->>CO: role (+ optional email)
    CO->>F: update purifier.ownerName (if changed)
    CO->>F: set invites/{random id}: pending, expires in 7 days
    CO-->>O: link …/invite/{id}
    O-->>I: sends link (Zalo, Messenger…) or tells them to open the app (email invite)
    I->>CI: open link / dashboard
    CI->>F: get invites/{id}
    CI->>CI: check: not own, pending, not expired, email matches & verified
    I->>CI: Accept
    CI->>F: batch: update purifier (memberIds ∪ me, roles.me, memberProfiles.me, lastInviteId = id) + update invite (accepted, acceptedBy = me)
    F->>F: purifier rule reads invite before/after, invite rule reads purifier after
    F-->>CI: ok → shared purifier appears via memberIds listener
```

A removed member cannot reuse their old invite: the purifier rule requires the invite to be `pending` *before* the batch.

## Leave or remove

```mermaid
sequenceDiagram
    actor M as Member (or owner)
    participant C as Client
    participant F as Firestore
    M->>C: Leave (or Remove member)
    C->>F: update purifier: memberIds − uid, delete roles.uid, delete memberProfiles.uid
    F-->>C: ok (rules: leave() for self, ownerUpdate() for owner)
    F-->>C: member's listeners lose access → purifier disappears from their lists
```

## Related

- Data access → [`../data-access.md`](../data-access.md)
- Rules → [`../../08-security/access-control.md`](../../08-security/access-control.md)
