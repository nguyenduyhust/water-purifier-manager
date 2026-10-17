# 02 · Requirements

**Last Updated**: 2026-10-17

What the system must do (functional), how well it must do it (non-functional) and the limits it works within (constraints). Requirement IDs (`FR-001`…) are stable; reference them from commits, specs and tests.

| Document | Contents |
|----------|----------|
| [functional/](functional/README.md) | Functional requirements, one file per domain |
| [non-functional.md](non-functional.md) | Performance, reliability, accessibility, platform support |
| [constraints.md](constraints.md) | Technical and business constraints |

## Goals

1. Let users manage their water purifiers and see at a glance which filters need replacing.
2. Support the purifier models common in Vietnam, with each model's real filter configuration.
3. Remind users before filters expire.
4. Let a household manage purifiers together.

## Scope

**In scope**: email/password, Google and Apple sign-in; purifier and filter management; replacement tracking and history; reminders (iOS); sharing with editors and viewers; English and Vietnamese; web and iOS.

**Out of scope**: an app-owned backend server, e-commerce or ordering filters, IoT device integration, Android (planned, not started), sending email.

## Status summary

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | [Authentication](functional/authentication.md) | Done |
| FR-002 | [Purifier management](functional/purifiers.md) | Done |
| FR-003 | [Purifier types](functional/purifiers.md#fr-003-purifier-types) | Done (custom types not planned) |
| FR-004 | [Filter management](functional/filters.md) | Done except per-filter interval editing |
| FR-005 | [Replacement reminders](functional/reminders.md) | Done on iOS; web shows dashboard alerts only |
| FR-006 | [Dashboard](functional/dashboard.md) | Done |
| FR-007 | [Data persistence and sync](functional/data-sync.md) | Done; offline support on iOS only |
| FR-008 | [Internationalization](functional/i18n.md) | Done |
| FR-009 | [Purifier sharing](functional/sharing.md) | Done (released with PR #3) |

## Related

- Glossary → [`../01-overview/glossary.md`](../01-overview/glossary.md)
- Screens implementing these requirements → [`../05-specs/screens/`](../05-specs/screens/README.md)
