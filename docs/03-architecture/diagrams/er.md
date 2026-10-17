# Data Model (ER)

**Last Updated**: 2026-10-17

Firestore is schemaless; this is the shape both apps write. Users are Firebase Auth accounts, not documents. Purifier types live in `shared/purifier-types.json`.

```mermaid
erDiagram
    AUTH_USER ||--o{ PURIFIER : "owns (userId)"
    AUTH_USER }o--o{ PURIFIER : "member of (memberIds, roles)"
    PURIFIER_TYPE ||--o{ PURIFIER : "template (typeId)"
    PURIFIER ||--|{ FILTER : "has (subcollection)"
    PURIFIER ||--o{ LOG : "history (subcollection)"
    PURIFIER ||--o{ INVITE : "invites (purifierId)"
    AUTH_USER ||--o{ INVITE : "creates (createdBy) / accepts (acceptedBy)"
    AUTH_USER ||--o{ LOG : "acts (actorId)"
    AUTH_USER ||--o{ ACTIVITY_LOG : "legacy (userId)"
    PURIFIER ||--o{ ACTIVITY_LOG : "legacy (purifierId)"

    AUTH_USER {
        string uid PK
        string email
        string displayName
        bool emailVerified
    }
    PURIFIER_TYPE {
        string id PK "e.g. kangaroo-kg102"
        map name "en, vi"
        array filterTemplates
    }
    PURIFIER {
        string id PK
        string userId FK "owner"
        string ownerName
        string typeId FK
        string typeName
        string name
        string location
        timestamp installationDate
        string notes
        array memberIds
        map roles "uid -> editor|viewer"
        map memberProfiles "uid -> name, email, joinedAt"
        string lastInviteId
        timestamp createdAt
        timestamp updatedAt
    }
    FILTER {
        string id PK
        string purifierId FK
        string userId FK "owner"
        int position
        string name
        int intervalMonths
        timestamp lastReplacedAt
        timestamp createdAt
        timestamp updatedAt
    }
    LOG {
        string id PK
        string type "purifier_created|filter_replaced"
        timestamp timestamp
        string purifierId FK
        string purifierName
        string filterId FK
        string filterName
        int filterPosition
        string notes
        string actorId FK
        string actorName
        string migratedFrom "only on migrated copies"
        timestamp createdAt
    }
    INVITE {
        string id PK "secret in the link"
        string purifierId FK
        string purifierName
        string role "editor|viewer"
        string email "null for link invites"
        string status "pending|accepted|declined"
        string createdBy FK
        string createdByName
        timestamp createdAt
        timestamp expiresAt
        string acceptedBy FK
        timestamp acceptedAt
    }
    ACTIVITY_LOG {
        string id PK
        string userId FK
        string type
        timestamp timestamp
        string purifierId FK
        string purifierName
        string filterId
        string filterName
        int filterPosition
        string notes
        timestamp createdAt
    }
```

## Related

- Per-collection specs → [`../../05-specs/database/`](../../05-specs/database/README.md)
