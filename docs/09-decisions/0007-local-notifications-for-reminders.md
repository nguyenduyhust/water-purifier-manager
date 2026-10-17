# 0007. Reminders are local notifications on iOS

**Status**: Accepted
**Date**: 2026-10-16
**Deciders**: Project owner

---

## Context

The main reason to have a mobile app is reminding users before filters expire. Every due date can be computed on the device from `lastReplacedAt + intervalMonths`.

## Decision

The iOS app schedules local notifications (7 days before and on the due date, 09:00) for all accessible filters and reschedules them whenever filters change. There is no push server.

## Alternatives considered

- **Push notifications from a backend (FCM + Cloud Functions/scheduler)** — works even if the app hasn't synced recently, and for the web; needs a backend and the Blaze plan.
- **Web push** — limited on iOS Safari and also needs a server.

## Consequences

- **Positive**: no backend; works offline; reminders follow shared purifiers automatically.
- **Negative / cost**: a device only knows about replacements it has synced; no web reminders; iOS caps pending notifications (the app schedules at most 60).
- **Committed to**: reminder logic in `NotificationScheduler`.
- **Reversal cost**: adding server push later can coexist.

## References

- [`../02-requirements/functional/reminders.md`](../02-requirements/functional/reminders.md)
