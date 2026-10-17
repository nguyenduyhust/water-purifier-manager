# Glossary

**Last Updated**: 2026-10-17

Terms used across the code and these docs. Vietnamese UI wording is given where it differs noticeably, because the product's main audience is Vietnamese.

## Domain

| Term | Vietnamese UI | Definition |
|------|---------------|------------|
| Purifier | Máy lọc nước | A water purification device a user tracks. Stored in `purifiers`. |
| Purifier type / model | Loại máy | A template from the catalog (e.g. "Kangaroo - KG102 (5 filters)") that defines which filters a purifier has and their default intervals. Stored in `shared/purifier-types.json`, not Firestore. |
| Filter / cartridge | Lõi lọc | A replaceable stage of a purifier. One document per filter in `purifiers/{id}/filters`. |
| Position | Lõi số N | The 1-based order of a filter within its purifier. |
| Interval | Chu kỳ thay | Months between replacements (`intervalMonths`). Copied from the template when the purifier is created. |
| Last replaced | Thay lần cuối | When the filter was last replaced (`lastReplacedAt`); the installation date for new purifiers. |
| Next replacement | Thay tiếp theo | `lastReplacedAt + intervalMonths`, computed on the client. |
| Filter status | Trạng thái | **OK** — more than 30 days left; **Due soon / Warning** (Sắp hết hạn) — 1–30 days left; **Expired** (Hết hạn) — 0 days or overdue. |
| Replacement | Thay lõi | Recording that a filter was replaced on a date; updates `lastReplacedAt` and adds a history entry. |
| History / log | Lịch sử | Entries in `purifiers/{id}/logs`: purifier created, filter replaced, with the actor's name. |
| Reminder | Nhắc nhở | iOS local notification 7 days before and on the due date, at 09:00. |

## Sharing

| Term | Vietnamese UI | Definition |
|------|---------------|------------|
| Owner | Chủ sở hữu | The user who created the purifier (`userId`). Full control. |
| Member | Thành viên | A user the purifier is shared with (listed in `memberIds`). |
| Editor | Người quản lý | Member role: can edit purifier details and replace filters. |
| Viewer | Người xem | Member role: read only. |
| Invite | Lời mời | A document in `invites` granting a role on one purifier. Single use, expires after 7 days. |
| Link invite | Bất kỳ ai có link | Invite with no email; anyone signed in who opens the link can accept it. |
| Email invite | — | Invite bound to one email; only a user signed in with that verified email can accept it. Shown on their dashboard. |
| Actor | Người thực hiện | The user who performed a logged action (`actorId`, `actorName`). |

## Technical

| Term | Definition |
|------|------------|
| Security rules | Firestore's server-side access checks (`firebase/firestore.rules`); the system's only authorization layer. |
| Realtime listener | A Firestore snapshot subscription that pushes changes to the client. |
| Subcollection | A collection nested under a document, e.g. `purifiers/{id}/filters`. |
| Emulator | The local Firebase Emulator Suite (Auth on 9099, Firestore on 8080) used for development and tests, with the demo project `demo-water-purifier`. |
| Legacy activity log | An entry in the top-level `activityLogs` collection written before sharing existed; migrated copies live in `purifiers/{id}/logs`. |
| Preview deploy | The Vercel build created for each pull request. |
| TestFlight | Apple's beta distribution for iOS builds. |

## Related

- Requirements → [`../02-requirements/README.md`](../02-requirements/README.md)
- Database → [`../05-specs/database/README.md`](../05-specs/database/README.md)
