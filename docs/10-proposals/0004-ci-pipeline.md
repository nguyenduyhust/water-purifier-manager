# 0004. Add a CI pipeline

**Status**: Draft
**Date**: 2026-10-17
**Authors**: Project owner

---

## Summary

Run lint, builds and the Firestore rules tests automatically on every pull request with GitHub Actions.

## Context

Only Vercel's preview build runs on PRs today ([CI/CD](../06-testing/ci-cd.md)). The rules tests — the most important tests in the repo — and the iOS tests run only when someone remembers to run them locally.

## Proposal

A workflow `.github/workflows/ci.yml` on `pull_request`:

| Job | Runner | Steps |
|-----|--------|-------|
| web | ubuntu | `npm ci`, `npm run lint`, `npm run build` (in `web/`) |
| rules | ubuntu + Java 21 | `npm ci`, `npm test` (in `firebase/`; with Java 21 available, firebase-tools can be unpinned) |
| ios (optional) | macOS | `xcodebuild test` (unit tests; UI tests skip without emulators) |

Later: start the emulators in CI, seed, and run the iOS UI tests and a committed web end-to-end script.

## Alternatives considered

- **Keep manual runs** — free, but easy to forget, and rules regressions are high impact.

## Consequences

- **Positive**: regressions caught before merge; branch protection can require green checks.
- **Negative / cost**: macOS runners are slow and costly on private repos; maintenance of the workflow.

## Open questions

- [ ] Include the iOS job, or only web + rules at first?

## References

- [`../06-testing/strategy.md`](../06-testing/strategy.md)
