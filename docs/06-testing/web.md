# Web Checks

**Last Updated**: 2026-10-17

The web app has no automated test suite yet. What it has:

## Static checks

| Check | Command | Expectation |
|-------|---------|-------------|
| Type-check + build | `npm run build` | Passes (Vite warns about the bundle size; known) |
| Lint | `npm run lint` | 0 errors (a few `react-hooks/exhaustive-deps` warnings remain) |

## End-to-end verification (manual)

Sharing was verified with a puppeteer script driving headless Chrome against `npm run dev:emulator` and the emulators. It covered 14 checks, three consecutive green runs:

1. Owner creates a purifier and a link invite.
2. A signed-out invitee opening the link is sent to sign-in, signs up, and returns to the invite.
3. Accepting lands on the purifier with "Shared by Alice · Your role: Editor".
4. The editor replaces a filter; the shared purifier appears in their list as "Shared · Editor".
5. The owner's history shows "by Bob".
6. After the owner switches Bob to viewer: no replace buttons, no edit link.
7. Email invite: an unverified invitee doesn't see it; after verification it appears on the dashboard and can be accepted.
8. A member leaves; the owner's members list updates.

The script lives outside the repo for now ([strategy](strategy.md#gaps-worth-closing)).

### Lessons for browser automation against the emulators

- **Navigate inside the SPA instead of reloading.** Each full reload leaves Firestore long-poll connections open for ~20–30 s; over HTTP/1.1 to the emulator, Chrome's limit of six connections per host then stalls writes. Production Firestore uses HTTP/2 and isn't affected.
- Wait for `domcontentloaded`, not `networkidle0` — Firestore keeps a connection open, so the network is never idle.
- Radix Select needs a short pause after opening before keyboard selection.
- The Auth emulator's `accounts:query` ignores email filters; find users in the full list.

## Manual checklist for UI changes

- Both languages (header switcher), light layout at phone width.
- As owner, editor and viewer (seed accounts) when the change touches purifier screens.

## Related

- Test data → [test-data.md](test-data.md)
