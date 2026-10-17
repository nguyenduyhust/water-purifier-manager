# 0002. One repository with a folder per platform

**Status**: Accepted
**Date**: 2026-10-16
**Deciders**: Project owner

---

## Context

The project started as a web app at the repository root. Adding a native iOS app (and possibly Android) raised the question of where it lives and how the platforms share the purifier catalog and the Firestore rules.

## Decision

We keep one repository with top-level folders `web/`, `ios/` (later `android/`), `shared/` for data used by every app, `firebase/` for rules, indexes and scripts, and `docs/`. The web app was moved into `web/` with `git mv`.

## Alternatives considered

- **Separate repositories per platform** — independent histories, but the catalog and rules would be copied or versioned across repos, and cross-platform changes would span several PRs.
- **JS monorepo tooling (apps/, packages/)** — adds structure the platforms can't use; Swift and TypeScript share no build tooling.

## Consequences

- **Positive**: one PR can change rules, web and iOS together; one source for the catalog; shared docs.
- **Negative / cost**: Vercel needs Root Directory `web` and access to files outside it; tooling commands run from subfolders.
- **Committed to**: the folder layout in [`../04-development/monorepo.md`](../04-development/monorepo.md).
- **Reversal cost**: splitting later is mechanical but loses the single-PR workflow.

## References

- Commits `9cf7ee3`, `763d3b2`, `71010c4` (PR #2)
