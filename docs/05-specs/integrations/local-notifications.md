# Local Notifications (iOS)

**Last Updated**: 2026-10-17

## Purpose

Filter replacement reminders without a push server ([ADR-0007](../../09-decisions/0007-local-notifications-for-reminders.md)).

## Implementation

`ios/WaterPurifierManager/Services/NotificationScheduler.swift`:

| Aspect | Behavior |
|--------|----------|
| Permission | Requested after sign-in (`alert`, `sound`, `badge`); Settings offers a retry or a link to iOS Settings |
| Schedule | Per filter: 7 days before the due date and on the due date, at 09:00 local time (`UNCalendarNotificationTrigger`) |
| Identifiers | `filter-reminder.<filterId>.soon` / `.due` — only these are removed on reschedule |
| Cap | 60 soonest requests (iOS keeps at most 64 pending per app) |
| Triggers | Filter snapshot changes (debounced 500 ms), app returning to the foreground |
| Foreground | Shown as banner + list + sound (`AppDelegate.willPresent`) |
| Sign-out | All app reminders removed |

## Limits

- Reminders only reflect data the device has seen; a filter replaced on another device updates them the next time this device syncs.
- No badge count, no web notifications, no per-purifier opt-out.

## Related

- Requirement → [FR-005](../../02-requirements/functional/reminders.md)
