# Constraints

**Last Updated**: 2026-10-17

Limits the system is designed within. Changing any of these is an architectural decision and needs an ADR.

## Technical

1. **No app-owned server.** Clients talk directly to Firebase; authorization lives in Firestore rules ([ADR-0001](../09-decisions/0001-client-only-firebase.md)). Anything that needs a trusted environment — sending email, looking up users by email, scheduled jobs — is out of reach until Cloud Functions are adopted ([proposal 0001](../10-proposals/0001-send-invite-emails.md)).
2. **Firebase project** `water-purifier-manager` is the single production backend for web and iOS.
3. **Web**: TypeScript strict mode, React + Vite, shadcn/ui + Tailwind, static hosting (Vercel). No `any` types.
4. **iOS**: SwiftUI, iOS 17 minimum, iPhone only, Swift Package Manager for dependencies.
5. **Shared behavior is duplicated, not shared code.** The filter status rule, Firestore writes and sharing logic exist once in TypeScript and once in Swift; they must be changed together ([CLAUDE.md](../../CLAUDE.md) "Changing Shared Behavior").
6. **Firestore limits** shape the design: batches hold 500 writes (deletes are chunked at 450), `in`/`array-contains` queries need indexes, rules may call `get()` a limited number of times per request.
7. **Local tooling**: the emulator tests use firebase-tools 13 because the development machine runs Java 11.

## Business

1. **Household scale.** Optimized for individuals and families; a purifier has at most 20 members.
2. **Free tier.** Should run within Firebase's and Vercel's free tiers.
3. **Vietnamese market first.** Vietnamese is the fallback language and the catalog covers models sold in Vietnam.
4. **Personal Apple Developer account.** iOS builds are signed and distributed with the owner's personal team (`HH22B576H5`), not a company team.

## Related

- Non-functional requirements → [non-functional.md](non-functional.md)
- Decisions → [`../09-decisions/`](../09-decisions/README.md)
