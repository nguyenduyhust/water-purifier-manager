# 01 · Overview

**Last Updated**: 2026-10-17

The big picture: what the system is, what it is built with, and the vocabulary used everywhere else in these docs. These pages change rarely; read them first.

| Document | Contents |
|----------|----------|
| [architecture.md](architecture.md) | System map — the two apps, the shared Firebase backend, shared data, how they connect |
| [tech-stack.md](tech-stack.md) | Languages, frameworks, libraries and services per platform |
| [glossary.md](glossary.md) | Domain and technical terms |

## The product in one paragraph

A user registers a water purifier by picking its model (Kangaroo, Karofi, Sunhouse…) and installation date. The app creates one record per filter cartridge with the manufacturer's replacement interval and shows each filter as OK, due soon (≤ 30 days) or expired. When a filter is replaced the user records it, and the schedule restarts. The iOS app also schedules local reminders. A purifier can be shared: its owner invites people as editors (who can replace filters) or viewers (read only), and everyone sees the same history of who did what.

## Related

- Requirements → [`../02-requirements/README.md`](../02-requirements/README.md)
- Architecture details → [`../03-architecture/README.md`](../03-architecture/README.md)
