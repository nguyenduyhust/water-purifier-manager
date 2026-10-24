# Test Strategy

**Last Updated**: 2026-10-23

## Principles

1. **Test the security boundary hardest.** Rules decide who can read and write everything; a mistake there leaks or corrupts data for every client. Every rule has allow and deny tests, and new tests are checked by temporarily breaking the rule (mutation check).
2. **Pin cross-platform behavior with unit tests.** The filter status rule exists in TypeScript and Swift; the Swift tests use cases whose expected results were computed with the web's date-fns code.
3. **Exercise real flows against the emulators**, never against production data.
4. **Prefer a few end-to-end checks of the main journeys** over many brittle UI tests.

## Coverage today

| Area | Kind | Where | Status |
|------|------|-------|--------|
| Firestore rules | Emulator tests (37) | `firebase/tests/` | ✅ Automated |
| Filter status rule, sorting | Unit (Swift Testing) | `ios/WaterPurifierManagerTests/FilterStatusCalculatorTests.swift` | ✅ |
| Purifier catalog | Unit | `ios/WaterPurifierManagerTests/PurifierTypeCatalogTests.swift` | ✅ |
| Roles, invite checks, invite links | Unit | `ios/WaterPurifierManagerTests/SharingTests.swift` | ✅ |
| Main journeys on iOS (auth, purifiers, filters, dashboard, settings, language, sharing, account deletion) | UI (XCTest) against emulators | `ios/WaterPurifierManagerUITests/` — see [test-cases.md](test-cases.md) | ✅ Needs emulators |
| Sharing journeys on web | End-to-end (puppeteer) against emulators | Run during development; script not committed | ⚠️ Manual |
| Web units (status service, hooks) | — | — | ❌ None |
| Data migrations | Rehearsal on emulators | `firebase/scripts/migrate-activity-logs.mjs --emulator` | ⚠️ Manual |

## Gaps worth closing

- Web unit tests for `filter-status-service` (mirror the Swift cases) and the history de-duplication.
- Commit the web end-to-end script and run it in CI.
- CI for rules tests and builds ([ci-cd.md](ci-cd.md)).

## Related

- Requirements tested → [`../02-requirements/functional/`](../02-requirements/functional/README.md)
