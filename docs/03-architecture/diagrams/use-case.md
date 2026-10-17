# Use Cases

**Last Updated**: 2026-10-17

Who can do what. Every signed-in user is an owner of the purifiers they create and may be an editor or viewer of others.

```mermaid
flowchart LR
    V([Viewer])
    E([Editor])
    O([Owner])
    I([Invitee])

    subgraph Read
        R1[View purifier and filters]
        R2[View history]
        R3[Get reminders - iOS]
    end
    subgraph Edit
        E1[Edit name, location, notes]
        E2[Replace a filter]
    end
    subgraph Manage
        M1[Add purifier]
        M2[Delete purifier]
        M3[Create / revoke invites]
        M4[Change roles, remove members]
    end
    subgraph Membership
        J1[Accept invite]
        J2[Decline email invite]
        J3[Leave purifier]
    end

    V --> R1 & R2 & R3 & J3
    E --> R1 & R2 & R3 & E1 & E2 & J3
    O --> R1 & R2 & R3 & E1 & E2 & M1 & M2 & M3 & M4
    I --> J1 & J2
```

## Related

- Access matrix → [`../../02-requirements/functional/sharing.md`](../../02-requirements/functional/sharing.md#access-matrix)
