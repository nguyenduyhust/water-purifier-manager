# 03 · Architecture

**Last Updated**: 2026-10-17

How the system is built. Both apps follow the same layering — screens on top, a state layer that owns realtime subscriptions, and a thin data-access layer over Firestore — so a change in one usually has an obvious counterpart in the other.

| Document | Contents |
|----------|----------|
| [web.md](web.md) | Web app layers: pages, hooks, services, routing, i18n |
| [ios.md](ios.md) | iOS app layers: views, stores, repositories, domain |
| [auth.md](auth.md) | Sign-in flows on both platforms and how identity reaches data |
| [data-access.md](data-access.md) | Queries, realtime listeners, batches, owned vs shared purifiers |
| [diagrams/](diagrams/README.md) | ER, sequence and use-case diagrams |

## Shared layering

```
┌──────────────────────────┐   ┌──────────────────────────┐
│ Web: pages/, components/ │   │ iOS: Features/ (SwiftUI) │   screens
├──────────────────────────┤   ├──────────────────────────┤
│ hooks/ + auth-context    │   │ Stores/ (@Observable)    │   state, subscriptions
├──────────────────────────┤   ├──────────────────────────┤
│ services/                │   │ Services/ (repositories) │   Firestore access
├──────────────────────────┤   ├──────────────────────────┤
│ filter-status-service    │   │ Domain/                  │   pure rules, no Firebase
└────────────┬─────────────┘   └────────────┬─────────────┘
             └────────── Firebase Auth + Firestore ─────────┘
                    (firebase/firestore.rules enforce access)
```

## Rules of thumb

- Screens never call Firestore directly; they go through hooks/stores, which call services/repositories.
- Business rules that must match across platforms (filter status, catalog parsing) live in a pure layer with unit tests.
- Writes go through the same document shapes on both platforms; the rules don't care which app sent them.
- Anything security-relevant is enforced in rules, never only in the UI. UI checks (hiding buttons for viewers) are for usability.

## Related

- System map → [`../01-overview/architecture.md`](../01-overview/architecture.md)
- Database → [`../05-specs/database/`](../05-specs/database/README.md)
- Decisions → [`../09-decisions/`](../09-decisions/README.md)
