# Data Persistence and Sync Requirements

**Version**: 1.1.0
**Last Updated**: 2026-10-17

## Overview

All user data lives in Cloud Firestore and both apps subscribe to it in real time, so changes made on one device or by another member show up everywhere without refreshing.

## Requirements

### FR-007: Data persistence and sync
- **Priority**: High
- **Status**: Done; offline support on iOS only
- **Acceptance criteria**:
  - [x] All data is stored in Firestore and survives closing the browser or app
  - [x] Purifier and filter changes sync in real time across tabs, devices and members
  - [x] Data is isolated per owner and per sharing role by security rules ([access control](../../08-security/access-control.md))
  - [x] iOS keeps working offline with the Firestore SDK's default on-device cache and syncs when back online
  - [ ] Web offline support — the web SDK uses its default in-memory cache; nothing is persisted across reloads while offline
  - [~] History refreshes when the History screen opens (and on pull-to-refresh on iOS); it is fetched, not streamed

---

**Related**: [README](README.md) · [Data access architecture](../../03-architecture/data-access.md) · [Firestore integration](../../05-specs/integrations/cloud-firestore.md)
