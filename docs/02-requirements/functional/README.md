# Functional Requirements

**Last Updated**: 2026-10-17

One file per domain. Each requirement lists its acceptance criteria with a checkbox for what the code does today, and notes any difference between the web and iOS apps.

| File | Requirements |
|------|--------------|
| [authentication.md](authentication.md) | FR-001 Authentication |
| [purifiers.md](purifiers.md) | FR-002 Purifier management, FR-003 Purifier types |
| [filters.md](filters.md) | FR-004 Filter management and status |
| [reminders.md](reminders.md) | FR-005 Replacement reminders |
| [dashboard.md](dashboard.md) | FR-006 Dashboard |
| [data-sync.md](data-sync.md) | FR-007 Data persistence and sync |
| [i18n.md](i18n.md) | FR-008 Internationalization |
| [sharing.md](sharing.md) | FR-009 Purifier sharing |

## User stories

The original user stories map onto these requirements:

| Story | As a user I want to… | Requirement |
|-------|----------------------|-------------|
| US-001 | create an account with my email | FR-001 |
| US-002 | sign in to my account | FR-001 |
| US-003 | reset my password by email | FR-001 |
| US-004 | add a purifier by picking its model and installation date | FR-002 |
| US-005 | see a purifier's filters with their status and dates | FR-002, FR-004 |
| US-006 | edit a purifier's name, location and notes | FR-002 |
| US-007 | delete a purifier after confirming | FR-002 |
| US-008 | record a filter replacement | FR-004 |
| US-009 | see past replacements | FR-004 (history page) |
| US-010 | change a filter's interval | FR-004 — not implemented |
| US-011 | see a summary of filters needing attention | FR-006 |
| US-012 | see upcoming replacements sorted by date | FR-006 |
| — | invite family members to view or manage a purifier | FR-009 |

## Related

- Non-functional → [`../non-functional.md`](../non-functional.md)
- Constraints → [`../constraints.md`](../constraints.md)
