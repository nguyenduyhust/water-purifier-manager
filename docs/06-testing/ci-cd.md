# CI/CD

**Last Updated**: 2026-10-17

## Today

| Trigger | What runs | Where |
|---------|-----------|-------|
| Pull request | Vercel preview build of `web/` (fails the check if the build fails) | Vercel GitHub integration |
| Push to `main` | Vercel production deploy of `web/` | Vercel |

There is no GitHub Actions workflow: rules tests, lint and iOS tests run only on developers' machines, and Firestore rules and iOS builds are deployed by hand ([deployment](../07-operations/deployment.md)).

## Recommended next step

A GitHub Actions workflow on pull requests with:

1. `web`: `npm ci && npm run lint && npm run build`
2. `firebase`: `npm ci && npm test` (needs Java)
3. Optionally `ios`: `xcodebuild test` on a macOS runner (UI tests skip without emulators)

Tracked as [proposal 0004](../10-proposals/0004-ci-pipeline.md).

## Related

- Workflow → [`../04-development/workflow.md`](../04-development/workflow.md)
