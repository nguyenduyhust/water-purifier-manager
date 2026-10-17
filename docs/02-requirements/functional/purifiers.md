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
  - [x] The catalog lists models sold in Vietnam: 42 models from 7 brands, 2–12 filters each
  - [x] Each model defines its filters (position, name, description, default interval in months)
  - [x] Names and descriptions exist in English and Vietnamese
  - [x] Web and iOS read the same file (`shared/purifier-types.json`)
  - [ ] User-defined custom models — not planned

| Brand | Models |
|-------|--------|
| Kangaroo | KG102, KG112, KG103, KG113, KG104, KG114, KG106, KG116, KG107, KG117, KG108, KG118, KG109, KG10A17, KG10A13, KG11A1, KG11A2, KG11A3, KG12A6, KG12A8 Sumire, KG400HD |
| Karofi | KSI80, Optimus O-i229/A, KAD-X60, KAD-X58, KAD-X59, KAQ-X18, KAQ-US08 |
| Sunhouse | SHR76210CK, SHA76222KL, SHA76623KL, SHA76656LA, SHA8866K, SHA8896L |
| Hòa Phát | HPN666, HPN669 |
| Toshiba | TWP-W2396SVN(M) |
| Mutosi | MP-S1011, MP-S1021H |
| A. O. Smith | Z7, G1 / G2, R400E |

---

**Related**: [README](README.md) · [Filters](filters.md) · [Sharing](sharing.md) · Database: [purifiers](../../05-specs/database/purifiers.md), [filters](../../05-specs/database/filters.md) · [Purifier types](../../05-specs/purifier-types.md) · [ADR-0003](../../09-decisions/0003-purifier-catalog-as-shared-json.md)
