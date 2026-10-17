# Dashboard Requirements

**Version**: 1.1.0
**Last Updated**: 2026-10-17

## Overview

The dashboard is the landing screen after sign-in. It answers "does anything need my attention?" across every purifier the user can access, and is where email invites addressed to the user appear.

## Requirements

### FR-006: Dashboard
- **Priority**: High
- **Status**: Done
- **Acceptance criteria**:
  - [x] Statistics: total purifiers, total filters, filters needing attention (expired + due soon), filters OK
  - [x] Lists of expired and due-soon filters with their purifier, linking to the purifier
  - [x] Shared purifiers count like owned ones
  - [x] Pending email invites for the user, with Accept and Decline ([FR-009](sharing.md))
  - [x] Empty state with a button to add the first purifier
  - [x] "Add purifier" action (web: header button; iOS: from the empty state and the Purifiers tab)

## Platform differences

| Element | Web | iOS |
|---------|-----|-----|
| Attention list | Two lists: expired, then due soon | One list ordered by urgency; "All filters are OK" when empty |
| Stats | Four cards | 2×2 grid of tiles |

---

**Related**: [README](README.md) · [Filters](filters.md) · [Sharing](sharing.md) · Screens: [web dashboard](../../05-specs/screens/web/dashboard.md), [iOS dashboard](../../05-specs/screens/ios/dashboard.md)
