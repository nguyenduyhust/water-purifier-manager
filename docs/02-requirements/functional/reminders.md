# Reminder Requirements

**Version**: 1.1.0
**Last Updated**: 2026-10-17

## Overview

Users should not have to open the app to find out a filter is due. The iOS app schedules local notifications on the device; there is no push server ([ADR-0007](../../09-decisions/0007-local-notifications-for-reminders.md)). The web app has no notifications and relies on the dashboard.

## Requirements

### FR-005: Replacement reminders
- **Priority**: High
- **Status**: Done on iOS; dashboard alerts on both platforms
- **Acceptance criteria**:
  - [x] Dashboard lists expired and due-soon filters on both platforms ([FR-006](dashboard.md))
  - [x] iOS asks for notification permission after sign-in
  - [x] iOS schedules, for every filter the user can access (owned and shared), a reminder 7 days before the due date and one on the due date, both at 09:00 local time
  - [x] Reminders in the past are skipped; at most 60 are scheduled (iOS allows 64 pending per app), soonest first
  - [x] Reminders are rescheduled whenever filters change, and when the app returns to the foreground
  - [x] Reminders show while the app is open (banner)
  - [x] Pending reminders are removed on sign-out
  - [x] Settings shows whether reminders are on and links to iOS Settings when denied
  - [ ] Web push notifications — not implemented
  - [ ] App icon badge with the number of filters needing attention — not implemented
  - [ ] Per-purifier "remind me" setting for shared purifiers — not implemented; every member gets reminders

## Notification content

| When | Title | Body |
|------|-------|------|
| 7 days before | Filter replacement coming up | `<filter>` in `<purifier>` is due in 7 days. |
| Due date | Time to replace a filter | `<filter>` in `<purifier>` is due today. |

Localized in English and Vietnamese.

---

**Related**: [README](README.md) · [Filters](filters.md) · [Local notifications integration](../../05-specs/integrations/local-notifications.md) · [iOS settings screen](../../05-specs/screens/ios/settings.md)
