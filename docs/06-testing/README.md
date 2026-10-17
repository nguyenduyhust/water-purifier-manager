# 06 · Testing

**Last Updated**: 2026-10-17

What is tested, how, and how to run it. The highest-risk code — the Firestore rules, which are the system's only authorization layer — has the most thorough tests.

| Document | Contents |
|----------|----------|
| [strategy.md](strategy.md) | What gets tested where, and why |
| [rules.md](rules.md) | Firestore rules tests (emulator) |
| [ios.md](ios.md) | iOS unit and UI tests |
| [web.md](web.md) | Web checks: build, lint, end-to-end verification |
| [test-data.md](test-data.md) | Seed data and test accounts |
| [ci-cd.md](ci-cd.md) | What runs automatically today |

## Commands

| What | Command |
|------|---------|
| Rules tests | `cd firebase && npm test` |
| iOS unit + UI tests | `cd ios && xcodebuild -project WaterPurifierManager.xcodeproj -scheme WaterPurifierManager -destination 'platform=iOS Simulator,name=iPhone 17 Pro' test` |
| Web type-check + build | `cd web && npm run build` |
| Web lint | `cd web && npm run lint` |
