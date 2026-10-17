# Input Validation

**Last Updated**: 2026-10-17

Client validation gives users fast feedback; rules enforce what must never be violated. A field validated only on the client can be bypassed by a crafted request — that's acceptable for cosmetic limits, not for access.

| Input | Client (web / iOS) | Rules |
|-------|--------------------|-------|
| Purifier name | Required, ≤ 100 | — |
| Location | ≤ 200 | — |
| Notes | ≤ 500 | — |
| Purifier type | Must be a catalog id (picker) | — |
| Installation date | Required (web); ≤ today (iOS) | — |
| Replacement date | Required (web); ≤ today (iOS) | Only `lastReplacedAt`, `intervalMonths`, `updatedAt` may change |
| Replacement notes | Trimmed; empty → `null` | — |
| Email / password (auth) | Email format, password ≥ 6, confirmation matches | Firebase Auth |
| Invite email | Email format (optional) | Must be lowercase string or `null` |
| Invite role | Picker: editor / viewer | Must be `editor` or `viewer` |
| Invite expiry | Set to now + 7 days | Must be in (now, now + 8 days) |
| Invite link (iOS paste) | `/invite/<id>` or bare 10–40 alphanumeric code | Unknown ids simply don't exist |
| Member roles | Picker | Only `editor` / `viewer`, keys match `memberIds` |
| Member count | — | ≤ 20 |
| Log entries | Written by the apps | `actorId` = caller, `type` in the two allowed values, immutable |

## Rendering

- Web renders all user text through React (escaped); no `dangerouslySetInnerHTML`.
- iOS renders through SwiftUI `Text`.

## Gaps

Length limits are client-only; a crafted request could store long strings in names or notes. Add rules constraints if this ever matters (size limits, string types).

## Related

- Access control → [access-control.md](access-control.md)
