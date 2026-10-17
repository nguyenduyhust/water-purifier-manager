# 0003. The purifier catalog is bundled JSON

**Status**: Accepted
**Date**: 2026-10-16
**Deciders**: Project owner

---

## Context

Purifier models (filters, intervals, bilingual names) were hard-coded in a TypeScript file. The iOS app needs the same data, and models change rarely and only by the maintainers.

## Decision

We store the catalog in `shared/purifier-types.json` and bundle it into both apps at build time. Purifiers reference models by `typeId` and copy the filter templates when created.

## Alternatives considered

- **A Firestore collection** — editable without releases, but needs admin tooling, rules, loading states and offline handling for data that rarely changes.
- **Duplicated code per platform** — drifts.

## Consequences

- **Positive**: one source of truth; works offline; validated by the web type-check and iOS unit tests.
- **Negative / cost**: new models need an app release on both platforms.
- **Committed to**: `id`s are permanent; changing a template doesn't change existing purifiers.
- **Reversal cost**: moving to Firestore later is straightforward (same JSON shape).

## References

- [`../05-specs/purifier-types.md`](../05-specs/purifier-types.md)
