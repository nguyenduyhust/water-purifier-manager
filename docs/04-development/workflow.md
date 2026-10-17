# Workflow

**Last Updated**: 2026-10-17

How changes go from a branch to users.

## Branches

`main` is always deployable: Vercel deploys it to production on every push. Work happens on short-lived branches:

| Prefix | Use |
|--------|-----|
| `feature/` | New functionality (`feature/purifier-sharing`) |
| `fix/` | Bug fixes |
| `refactor/` | Restructuring without behavior change (`refactor/monorepo-web`) |
| `docs/` | Documentation only |
| `chore/` | Tooling, dependencies, version bumps |

## Commits

```
type(scope): description

[optional body: why, not what]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Scopes in use: `web`, `ios`, `firebase`, `purifier`, `filter`, `auth`. Examples:

- `feat(ios): share purifiers with editors and viewers`
- `fix(ios): set default home screen name in Info.plist`
- `chore(firebase): add Firestore rules and indexes as code`

Check `git status` before committing; never commit `.env.local`, `GoogleService-Info.plist` or `Firebase.xcconfig`.

## Pull requests

- One topic per PR; describe what changed and why.
- Include a **test plan** with what was verified and what still needs manual checking.
- Vercel posts a preview deployment for every PR; check it for web changes.
- Changes that touch Firestore rules list the release order in the PR (see below).

## Releasing

### Web
Merging to `main` deploys https://water-purifier-manager.vercel.app.

### Firestore rules and indexes
Deploy **before** merging client code that depends on them, so the live web app never runs against rules that reject it. New rules must keep accepting what the currently released clients send. See [deployment](../07-operations/deployment.md).

### iOS
Bump `CURRENT_PROJECT_VERSION` (build number) for every upload; bump `MARKETING_VERSION` for user-visible releases. Archive and upload to TestFlight as described in [deployment](../07-operations/deployment.md#ios-testflight).

### Data migrations
Write them as idempotent scripts in `firebase/scripts/` that audit by default, rehearse on the emulators, then run against production. See [data migrations](../07-operations/data-migrations.md).

## Definition of done

- Web: `npm run build` passes, `npm run lint` has no errors.
- iOS: builds without warnings; unit tests pass; UI tests pass against the emulators if the change touches their flows.
- Rules: `cd firebase && npm test` passes, with tests for new rules.
- Docs: the relevant files in `docs/` and `CLAUDE.md` are updated.

## Related

- Conventions → [conventions.md](conventions.md)
- Testing → [`../06-testing/`](../06-testing/README.md)
- Operations → [`../07-operations/`](../07-operations/README.md)
