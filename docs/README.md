# Water Purifier Manager — Documentation

**Last Updated**: 2026-10-17

Water Purifier Manager helps households keep track of their water purifiers and when each filter cartridge needs replacing. It ships as a React web app and a native iOS app that share one Firebase backend, and purifiers can be shared with family members as editors or viewers. This directory holds the project's requirements, architecture, specifications and operational documentation, organized into per-topic folders.

For a high-level orientation, start with [01-overview/](01-overview/README.md).

---

## How to read these docs

### New developer onboarding
1. [01-overview/architecture.md](01-overview/architecture.md) — system map (web, iOS, Firebase, shared data)
2. [01-overview/tech-stack.md](01-overview/tech-stack.md) — languages, frameworks, services
3. [01-overview/glossary.md](01-overview/glossary.md) — domain terms (purifier, filter, owner, member, invite, …)
4. [04-development/getting-started.md](04-development/getting-started.md) — run the apps locally, against production or the emulators
5. [02-requirements/README.md](02-requirements/README.md) — what the system is supposed to do
6. [03-architecture/README.md](03-architecture/README.md) — how it's built
7. [04-development/conventions.md](04-development/conventions.md) and [workflow.md](04-development/workflow.md) — how we write code and ship it
8. The repo root [`CLAUDE.md`](../CLAUDE.md) — codebase conventions and common commands

### AI assistants
Load files on demand rather than all at once. The per-topic folders (`05-specs/database/`, `05-specs/screens/`, `02-requirements/functional/`, …) are split into one file per entity so retrieval stays focused. The repo root `CLAUDE.md` is the canonical source for codebase conventions; this `docs/` tree is the canonical source for *what the system does and why*.

### Releasing or operating the system
Start at [07-operations/](07-operations/README.md). Deployment order matters when Firestore rules change — see [07-operations/deployment.md](07-operations/deployment.md).

---

## Directory layout

| Folder | Contents |
|--------|----------|
| [`01-overview/`](01-overview/README.md) | System map, tech stack, glossary — stable, change rarely |
| [`02-requirements/`](02-requirements/README.md) | Functional requirements (one file per domain), non-functional requirements, constraints |
| [`03-architecture/`](03-architecture/README.md) | How the web and iOS apps are built, auth, data access, diagrams |
| [`04-development/`](04-development/README.md) | Local setup, repository layout, coding conventions, workflow, recipes |
| [`05-specs/`](05-specs/README.md) | Contract-level specs |
| [`05-specs/database/`](05-specs/database/README.md) | One file per Firestore collection |
| [`05-specs/screens/`](05-specs/screens/README.md) | One file per screen, for the web and iOS apps |
| [`05-specs/integrations/`](05-specs/integrations/README.md) | One file per external system (Firebase Auth, Firestore, Google, Apple, Vercel, App Store Connect, notifications) |
| [`06-testing/`](06-testing/README.md) | Test strategy, rules tests, iOS tests, web end-to-end checks, test data, CI |
| [`07-operations/`](07-operations/README.md) | Environments, deployment, data migrations, backup, monitoring, incidents |
| [`08-security/`](08-security/README.md) | Threat model, access control, data protection, input validation |
| [`09-decisions/`](09-decisions/README.md) | Architecture Decision Records (ADRs) — why irreversible choices were made |
| [`10-proposals/`](10-proposals/README.md) | RFCs — forward-looking proposals with a Draft → Accepted/Rejected lifecycle |

Platform READMEs complement these docs: [`ios/README.md`](../ios/README.md) (iOS setup and parity rules) and [`shared/README.md`](../shared/README.md) (purifier catalog format).

---

## Migration history

Documentation used to live in three large files at the top of `docs/`. Their content was checked against the code, corrected where it had drifted, and moved into the folders above; the legacy files were deleted.

| Legacy file | Lives now in |
|-------------|--------------|
| `REQUIREMENTS.md` | [`02-requirements/`](02-requirements/README.md) (functional requirements FR-001…FR-009 per domain, non-functional, constraints); data models in [`05-specs/database/`](05-specs/database/README.md); glossary in [`01-overview/glossary.md`](01-overview/glossary.md) |
| `ARCHITECTURE.md` | [`01-overview/`](01-overview/README.md) and [`03-architecture/`](03-architecture/README.md); decision log in [`09-decisions/`](09-decisions/README.md); deployment in [`07-operations/`](07-operations/README.md); security in [`08-security/`](08-security/README.md) |
| `CONVENTIONS.md` | [`04-development/conventions.md`](04-development/conventions.md) and [`workflow.md`](04-development/workflow.md) |

Corrections made during the move: purifier editing and the history page exist (they were marked as missing); the web app falls back to Vietnamese, not English; error classes, error boundaries, lazy-loaded routes and a Prettier config described in the old architecture doc were never implemented and are not documented as if they were.

---

## Contributing to these docs

- **One file per "thing"** — one collection, one screen, one integration. Smaller files diff cleanly and retrieve well for AI tools.
- **Document what exists** — describe the code as it is. Planned work belongs in [`10-proposals/`](10-proposals/README.md) or is marked as not implemented.
- **Cross-link liberally** — every doc links to its peers (a screen spec links to the requirement it implements and the collections it reads).
- **Lead with intent** — start each doc with one paragraph answering *what is this and why does it exist*, before any tables.
- **Date stamps** — top of each file: `**Last Updated**: YYYY-MM-DD`. Keep these honest.
- **Decisions go in ADRs** — if you find yourself writing "we chose X because…" in a spec, that paragraph belongs in [`09-decisions/`](09-decisions/README.md) and the spec links to it.
- **Web and iOS together** — when behavior changes on one platform, update the shared spec and note any platform difference explicitly.

---

## Quick index

- Architecture overview → [01-overview/architecture.md](01-overview/architecture.md)
- Domain glossary → [01-overview/glossary.md](01-overview/glossary.md)
- Functional requirements → [02-requirements/functional/README.md](02-requirements/functional/README.md)
- Sharing (FR-009) → [02-requirements/functional/sharing.md](02-requirements/functional/sharing.md)
- Firestore collections → [05-specs/database/README.md](05-specs/database/README.md)
- Screens → [05-specs/screens/README.md](05-specs/screens/README.md)
- Security rules → [08-security/access-control.md](08-security/access-control.md)
- Deployment → [07-operations/deployment.md](07-operations/deployment.md)
- ADRs → [09-decisions/README.md](09-decisions/README.md)
- Proposals → [10-proposals/README.md](10-proposals/README.md)
- Local setup → [04-development/getting-started.md](04-development/getting-started.md)
- Codebase conventions → [`../CLAUDE.md`](../CLAUDE.md)
