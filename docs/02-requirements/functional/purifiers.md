# Purifier Requirements

**Version**: 1.2.0
**Last Updated**: 2026-10-17

## Overview

A purifier is a device the user tracks. It is created from a model in the catalog, which decides its filters. After creation the model can't be changed; name, location and notes can. Purifiers belong to their creator (the owner) and can be shared ([FR-009](sharing.md)).

## Data Model Summary

- **Purifier** (`purifiers`): `userId` (owner), `typeId`, `typeName`, `name`, `location`, `installationDate`, `notes`, `createdAt`, `updatedAt`, plus sharing fields — see [database spec](../../05-specs/database/purifiers.md)
- **Purifier type**: catalog entry in `shared/purifier-types.json` — see [purifier types spec](../../05-specs/purifier-types.md)

## Requirements

### FR-002: Purifier management
- **Priority**: High
- **Status**: Done
- **Acceptance criteria**:
  - [x] Add a purifier: name (1–100 chars), model, location (≤ 200, optional), installation date, notes (≤ 500, optional)
  - [x] Creating a purifier creates one filter per template, with the template's interval and `lastReplacedAt` = installation date, in the same batch as the purifier (web and iOS)
  - [x] A "purifier created" history entry is written, dated the installation date
  - [x] List all purifiers the user owns or that are shared with them, newest first
  - [x] View a purifier's details and filters
  - [x] Edit name, location and notes — owner and editors
  - [x] Delete with confirmation — owner only; also deletes its filters, history and pending invites
  - [ ] Change the model of an existing purifier — not supported

### FR-003: Purifier types
- **Priority**: High
- **Status**: Done
- **Acceptance criteria**:
  - [x] The catalog lists the models sold in Vietnam: 13 Kangaroo, 3 Karofi, 1 Sunhouse (17 in total, 5–10 filters each)
  - [x] Each model defines its filters (position, name, description, default interval in months)
  - [x] Names and descriptions exist in English and Vietnamese
  - [x] Web and iOS read the same file (`shared/purifier-types.json`)
  - [ ] User-defined custom models — not planned

| Brand | Models |
|-------|--------|
| Kangaroo | KG102, KG112, KG103, KG113, KG104, KG114, KG106, KG116, KG107, KG117, KG108, KG118, KG109 |
| Karofi | KSI80, Optimus O-i229, KAD-X60 |
| Sunhouse | SHR76210CK |

---

**Related**: [README](README.md) · [Filters](filters.md) · [Sharing](sharing.md) · Database: [purifiers](../../05-specs/database/purifiers.md), [filters](../../05-specs/database/filters.md) · [Purifier types](../../05-specs/purifier-types.md) · [ADR-0003](../../09-decisions/0003-purifier-catalog-as-shared-json.md)
