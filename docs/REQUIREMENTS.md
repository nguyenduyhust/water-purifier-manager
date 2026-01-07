# Project Requirements - Water Purifier Manager

> This document tracks project requirements, user stories, and acceptance criteria for the Water Purifier Manager application.

## Table of Contents

- [Overview](#overview)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [User Stories](#user-stories)
- [Data Requirements](#data-requirements)
- [Security Requirements](#security-requirements)
- [Constraints](#constraints)

---

## Overview

### Project Goals

1. **Primary Goal:** Enable users to manage their water purifiers and track filter replacement schedules
2. **Secondary Goals:**
   - Provide timely notifications when filters need replacement
   - Support multiple water purifier types with different filter configurations
   - Offer a simple, intuitive user interface for filter management

### Success Metrics

| Metric | Target |
|--------|--------|
| User can add a purifier | < 1 minute |
| Filter status visibility | At a glance |
| Notification accuracy | 100% on-time |

### Scope

**In Scope:**
- User authentication (Firebase Auth - Email/Password + Google)
- Water purifier CRUD operations
- Filter cartridge management per purifier
- Filter replacement tracking
- Multiple purifier types with configurable filter counts
- Multi-language support (English and Vietnamese)
- Responsive web application

**Out of Scope:**
- Mobile native applications
- Backend server (client-side only with Firebase)
- E-commerce/filter purchasing
- IoT device integration
- Push notifications (planned for future)

---

## Functional Requirements

### FR-001: User Authentication

**Description:** Users can register, login, and logout using Firebase Authentication

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] Users can register with email and password
- [x] Users can login with email and password
- [x] Users can login with Google
- [x] Users can logout
- [x] Users can reset their password via email
- [x] Authentication state persists across browser sessions
- [x] Unauthenticated users are redirected to login page

---

### FR-002: Water Purifier Management

**Description:** Users can manage (CRUD) their water purifiers

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] Users can add a new water purifier
- [x] Users can view a list of all their purifiers
- [x] Users can view details of a specific purifier
- [ ] Users can edit purifier information (name, location, notes)
- [x] Users can delete a purifier (with confirmation)
- [x] Each purifier belongs to one user only
- [x] Users can select from predefined purifier types

---

### FR-003: Purifier Type Management

**Description:** System supports different water purifier types with varying filter configurations

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] System provides predefined purifier types (Vietnamese brands)
- [x] Each purifier type defines number of filter cartridges
- [x] Each purifier type defines default replacement intervals per cartridge
- [x] Purifier types support bilingual names/descriptions (English/Vietnamese)
- [ ] Users can create custom purifier types (future)

**Predefined Purifier Types (Vietnamese Brands):**

| Brand | Model | Filter Count |
|-------|-------|--------------|
| Kangaroo | KG104 | 7 filters |
| Kangaroo | KG106 | 8 filters |
| Kangaroo | KG108 | 8 filters |
| Kangaroo | KG116 | 9 filters |
| Kangaroo | KG109 | 9 filters |
| Karofi | KSI80 | 8 filters |
| Karofi | Optimus O-i229 | 9 filters |
| Karofi | KAD-X60 | 10 filters |
| Sunhouse | SHR76210CK | 10 filters |

---

### FR-004: Filter Cartridge Management

**Description:** Users can manage individual filter cartridges for each purifier

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] Each purifier displays its filter cartridges based on type
- [x] Users can view filter status (OK, Warning, Expired)
- [x] Users can record filter replacement (updates last replaced date)
- [ ] Users can view filter replacement history
- [ ] Users can customize replacement interval for individual filters
- [x] Filter status calculated based on last replacement and interval

**Filter Status Logic:**
- **OK (Green):** More than 30 days until replacement
- **Warning (Yellow):** 30 days or less until replacement
- **Expired (Red):** Past replacement date

---

### FR-005: Filter Replacement Notifications

**Description:** System notifies users when filters need replacement

**Priority:** High

**Status:** Partially Completed

**Acceptance Criteria:**
- [x] Dashboard shows summary of filters needing attention
- [x] Filters due within 30 days shown with warning indicator
- [x] Overdue filters shown with expired/urgent indicator
- [ ] Notification badge shows count of filters needing attention
- [x] Users can see filters needing attention on dashboard
- [ ] Push notifications (planned for future)

---

### FR-006: Dashboard

**Description:** Main dashboard showing overview of all purifiers and filter statuses

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] Dashboard shows all user's purifiers
- [x] Dashboard shows statistics (total purifiers, total filters, needs attention)
- [x] Dashboard shows filters needing attention with quick links
- [x] Each purifier card shows summary filter status
- [x] Quick actions available (view details, record replacement)
- [x] Empty state for new users with no purifiers

---

### FR-007: Data Persistence

**Description:** All user data stored in Firebase Firestore

**Priority:** High

**Status:** Completed

**Acceptance Criteria:**
- [x] Data syncs in real-time across browser tabs
- [x] Data persists after browser close/reopen
- [ ] Offline support with sync when back online
- [x] Data isolated per user (security rules)

---

### FR-008: Internationalization (i18n)

**Description:** Application supports multiple languages

**Priority:** Medium

**Status:** Completed

**Acceptance Criteria:**
- [x] UI supports English and Vietnamese
- [x] Language can be switched from settings
- [x] Language preference persists (localStorage)
- [x] Dates formatted according to locale
- [x] Purifier type names and descriptions available in both languages

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Initial Page Load | < 3 seconds | Lighthouse |
| Time to Interactive | < 5 seconds | Lighthouse |
| Firestore Read Latency | < 500ms | Firebase Console |
| UI Responsiveness | 60 fps | Chrome DevTools |

### Reliability

- **Uptime Target:** Dependent on Firebase (99.95%)
- **Data Durability:** Firebase Firestore guarantees
- **Offline Support:** Basic read/write with sync

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Sufficient color contrast
- [ ] Focus indicators visible

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

### Mobile Support

- [ ] Responsive design (320px - 2560px)
- [ ] Touch-friendly interactions (min 44px touch targets)
- [ ] Mobile-first design approach

---

## User Stories

### Epic: Authentication

#### US-001: User Registration

**As a** new user
**I want** to create an account with my email
**So that** I can start managing my water purifiers

**Acceptance Criteria:**
```gherkin
Given I am on the registration page
When I enter a valid email and password
And I click the register button
Then my account is created
And I am logged in and redirected to the dashboard
```

---

#### US-002: User Login

**As a** registered user
**I want** to login to my account
**So that** I can access my water purifier data

**Acceptance Criteria:**
```gherkin
Given I am on the login page
When I enter my email and password
And I click the login button
Then I am authenticated
And I am redirected to the dashboard
```

---

#### US-003: Password Reset

**As a** user who forgot my password
**I want** to reset my password via email
**So that** I can regain access to my account

**Acceptance Criteria:**
```gherkin
Given I am on the login page
When I click "Forgot Password"
And I enter my email
Then I receive a password reset email
And I can set a new password via the link
```

---

### Epic: Purifier Management

#### US-004: Add Water Purifier

**As a** user
**I want** to add a new water purifier
**So that** I can track its filters

**Acceptance Criteria:**
```gherkin
Given I am on the dashboard
When I click "Add Purifier"
And I select a purifier type
And I enter a name and optional location
And I enter the installation date
Then the purifier is added to my list
And I can see its filter cartridges
```

---

#### US-005: View Purifier Details

**As a** user
**I want** to view details of my purifier
**So that** I can see all filter statuses

**Acceptance Criteria:**
```gherkin
Given I have a purifier in my list
When I click on the purifier card
Then I see the purifier details page
And I see all filter cartridges with their status
And I see last replacement dates
And I see next replacement dates
```

---

#### US-006: Edit Purifier

**As a** user
**I want** to edit my purifier information
**So that** I can keep details accurate

**Acceptance Criteria:**
```gherkin
Given I am on a purifier details page
When I click "Edit"
And I modify the name or location
And I save changes
Then the purifier is updated
And I see the updated information
```

---

#### US-007: Delete Purifier

**As a** user
**I want** to delete a purifier
**So that** I can remove purifiers I no longer own

**Acceptance Criteria:**
```gherkin
Given I am on a purifier details page
When I click "Delete"
Then I see a confirmation dialog
When I confirm deletion
Then the purifier and its filters are removed
And I am redirected to the dashboard
```

---

### Epic: Filter Management

#### US-008: Record Filter Replacement

**As a** user
**I want** to record when I replace a filter
**So that** the system tracks the new replacement date

**Acceptance Criteria:**
```gherkin
Given I am viewing a purifier's filters
When I click "Replace" on a filter
And I optionally select/confirm the replacement date
Then the filter's last replacement date is updated
And the next replacement date is calculated
And the filter status updates accordingly
```

---

#### US-009: View Filter History

**As a** user
**I want** to view the replacement history of a filter
**So that** I can see maintenance patterns

**Acceptance Criteria:**
```gherkin
Given I am viewing a filter
When I click "View History"
Then I see a list of all past replacements
With dates and any notes
```

---

#### US-010: Customize Filter Interval

**As a** user
**I want** to customize a filter's replacement interval
**So that** I can adjust based on my water quality

**Acceptance Criteria:**
```gherkin
Given I am viewing a filter
When I click "Edit Interval"
And I enter a new interval in months
And I save
Then the filter's interval is updated
And the next replacement date recalculates
```

---

### Epic: Notifications & Dashboard

#### US-011: View Dashboard Summary

**As a** user
**I want** to see a summary of all my filters
**So that** I know what needs attention

**Acceptance Criteria:**
```gherkin
Given I am logged in
When I view the dashboard
Then I see all my purifiers
And I see a count of filters needing attention
And expired/warning filters are highlighted
```

---

#### US-012: View Upcoming Replacements

**As a** user
**I want** to see all upcoming filter replacements
**So that** I can plan my maintenance

**Acceptance Criteria:**
```gherkin
Given I have purifiers with filters
When I view the "Upcoming" section
Then I see filters sorted by next replacement date
And I see which purifier each filter belongs to
```

---

## Data Requirements

### Data Models

#### User (Firebase Auth)

Managed by Firebase Authentication - no custom storage needed.

| Field | Type | Source |
|-------|------|--------|
| uid | string | Firebase Auth |
| email | string | Firebase Auth |
| displayName | string | Firebase Auth |

---

#### PurifierType

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, auto | Unique identifier |
| name | string | Required | Type name (e.g., "Standard 5-Stage") |
| isCustom | boolean | Required | Whether user-created |
| userId | string | FK, nullable | Owner (null for system types) |
| filterTemplates | FilterTemplate[] | Required | Filter configurations |
| createdAt | timestamp | Auto | Creation time |

---

#### FilterTemplate (embedded in PurifierType)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| position | number | Required | Order/slot number (1-based) |
| name | string | Required | Filter name (e.g., "Sediment") |
| defaultIntervalMonths | number | Required | Default replacement interval |
| description | string | Optional | Filter description |

---

#### Purifier

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, auto | Unique identifier |
| userId | string | FK, required | Owner user ID |
| typeId | string | FK, required | Reference to PurifierType |
| name | string | Required | User-given name |
| location | string | Optional | Installation location |
| installationDate | timestamp | Required | When purifier was installed |
| notes | string | Optional | User notes |
| createdAt | timestamp | Auto | Creation time |
| updatedAt | timestamp | Auto | Last update time |

---

#### Filter

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, auto | Unique identifier |
| purifierId | string | FK, required | Parent purifier |
| userId | string | FK, required | Owner user ID |
| position | number | Required | Slot position |
| name | string | Required | Filter name |
| intervalMonths | number | Required | Replacement interval |
| lastReplacedAt | timestamp | Required | Last replacement date |
| nextReplacementAt | timestamp | Computed | Next replacement date |
| createdAt | timestamp | Auto | Creation time |
| updatedAt | timestamp | Auto | Last update time |

---

#### FilterReplacement (History)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, auto | Unique identifier |
| filterId | string | FK, required | Parent filter |
| userId | string | FK, required | Owner user ID |
| replacedAt | timestamp | Required | Replacement date |
| notes | string | Optional | User notes |
| createdAt | timestamp | Auto | Creation time |

---

### Firestore Collection Structure

```
/users/{userId}                          # User preferences (optional)
/purifierTypes/{typeId}                  # System + custom purifier types
/purifiers/{purifierId}                  # User's purifiers
/purifiers/{purifierId}/filters/{filterId}  # Filters as subcollection
/filterReplacements/{replacementId}      # Replacement history
```

### Data Validation Rules

1. **Email:** Valid email format (handled by Firebase Auth)
2. **Names:** 1-100 characters, trimmed
3. **Intervals:** 1-60 months
4. **Dates:** Cannot be in the future for replacements
5. **Position:** 1-10 (max 10 filters per purifier)

---

## Security Requirements

### Authentication

- [x] Firebase Authentication (email/password)
- [x] OAuth 2.0 (Google Sign-In)
- [x] Session management via Firebase SDK
- [x] Password requirements: min 6 characters (Firebase default)

### Authorization (Firestore Security Rules)

- [ ] Users can only read/write their own data
- [ ] System purifier types readable by all authenticated users
- [ ] Custom purifier types only accessible by creator
- [ ] All write operations require authentication

### Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Purifier types
    match /purifierTypes/{typeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // Purifiers
    match /purifiers/{purifierId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      // Filters subcollection
      match /filters/{filterId} {
        allow read, write: if request.auth != null
          && get(/databases/$(database)/documents/purifiers/$(purifierId)).data.userId == request.auth.uid;
      }
    }

    // Filter replacements
    match /filterReplacements/{replacementId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Constraints

### Technical Constraints

1. **Platform:** Web application only (React SPA)
2. **Language:** TypeScript (strict mode)
3. **Framework:** React with Vite
4. **UI Library:** shadcn/ui with Tailwind CSS
5. **Database:** Firebase Firestore (NoSQL)
6. **Authentication:** Firebase Authentication
7. **Hosting:** Static hosting compatible (Firebase Hosting, Vercel, Netlify)

### Business Constraints

1. **No Server:** Client-side only architecture
2. **Free Tier:** Should work within Firebase free tier for small usage
3. **Single User Focus:** Optimized for individual/family use

### Dependencies

| Dependency | Purpose |
|------------|---------|
| React 18+ | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Firebase | Auth + Database |
| React Router | Navigation |
| React Hook Form | Form handling |
| Zod | Validation |
| date-fns | Date manipulation |
| Lucide React | Icons |

---

## Glossary

| Term | Definition |
|------|------------|
| Purifier | A water purification device |
| Filter/Cartridge | Replaceable filtering component in a purifier |
| Filter Stage | Position/slot of a filter in the purification sequence |
| Replacement Interval | Time period after which a filter should be replaced |
| Purifier Type | A template defining filter configuration for a purifier model |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-07 | 1.0.0 | Initial requirements | Claude |
| 2025-01-07 | 1.1.0 | Added i18n requirement (FR-008), updated status of all requirements, added Vietnamese purifier brands, Google Sign-In | Claude |
