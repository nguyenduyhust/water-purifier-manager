# Test Cases

**Last Updated**: 2026-10-23

Every user-facing function, its test cases, and how to run each one. Use this list for release checks: run the automated suites, then walk through the cases marked **Manual** on a device.

## How to read this

- **ID**: `TC-<area>-<nn>`; cite it in bug reports and PRs.
- **Platform**: iOS, Web, or Both. Steps are written for iOS; the web equivalent is noted where it differs.
- **Automated by**: the test that covers the case. `UI:` = XCUITest in `ios/WaterPurifierManagerUITests/`, `Unit:` = Swift Testing in `ios/WaterPurifierManagerTests/`, `Rules:` = `firebase/tests/firestore.rules.test.ts`. **Manual** = not automated; follow the steps by hand.
- **Data**: unless a case says otherwise, run against the emulators with `firebase/scripts/seed-sharing.mjs` ([test data](test-data.md)). UI tests that need their own data create fresh users and documents through the emulators' REST API, so they don't depend on each other.

## Running everything

```bash
# 1. Emulators (keep running) and seed data
cd firebase
npx firebase emulators:start --only auth,firestore --project demo-water-purifier
node scripts/seed-sharing.mjs

# 2. Rules tests (start their own emulator; stop the one above first, or run in another checkout)
npm test

# 3. iOS unit + UI tests, one simulator at a time (the tests share the emulators)
cd ../ios
xcodebuild test -project WaterPurifierManager.xcodeproj -scheme WaterPurifierManager \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -parallel-testing-enabled NO

# 4. Web
cd ../web && npm run build && npm run lint
```

Reseed (`node scripts/seed-sharing.mjs`) before re-running the UI tests: some of them use the seed accounts and change their data.

---

## 1. Authentication (FR-001)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-AUTH-01 | Sign up with email | Sign in screen → *Don't have an account? Sign up* → enter name, new email, password ×2 (≥ 6) → *Create account* | Signed in; tabs appear; Dashboard shows the empty state | Both | UI: `FunctionalUITests.testSignUpShowsEmptyDashboard` |
| TC-AUTH-02 | Sign up: passwords differ | Sign up → password `secret123`, confirm `secret124` | "Passwords don't match"; *Create account* disabled | Both | UI: `FunctionalUITests.testSignUpRejectsMismatchedPasswords` |
| TC-AUTH-03 | Sign up: email already used | Sign up with `alice@example.com` | Error "This email is already in use"; stays on sign up | Both | Manual |
| TC-AUTH-04 | Sign in | Enter `alice@example.com` / `secret123` → *Sign in* | Tabs appear | Both | UI: every UI test (`launchSignedIn`) |
| TC-AUTH-05 | Sign in: wrong password | Enter `alice@example.com` / `wrongpass` → *Sign in* | Error "Invalid email or password"; stays signed out | Both | UI: `FunctionalUITests.testSignInWithWrongPasswordShowsError` |
| TC-AUTH-06 | Sign in: button disabled | Leave email empty or password < 6 characters | *Sign in* disabled | iOS | UI: `FunctionalUITests.testSignInWithWrongPasswordShowsError` |
| TC-AUTH-07 | Forgot password | *Forgot password?* → email → *Send reset link* | "Check your email" with the address; *Back to sign in* returns | Both | UI: `FunctionalUITests.testForgotPasswordSendsResetLink` |
| TC-AUTH-08 | Sign in with Google | *Continue with Google* → choose account | Signed in with the Google name | Both | Manual (real Google account) |
| TC-AUTH-09 | Sign in with Apple | Sign in with Apple button → Face ID | Signed in; first sign-in sets the name | iOS | Manual (real Apple ID, device) |
| TC-AUTH-10 | Stay signed in | Sign in → quit and relaunch the app (web: close and reopen the tab) | Still signed in | Both | UI: `ScreenshotTests` relaunch; Manual on web |
| TC-AUTH-11 | Sign out | Settings → *Sign out* → confirm (web: avatar menu → Sign out) | Sign in screen; iOS removes pending reminders | Both | UI: `FunctionalUITests.testSignOutReturnsToSignIn` |
| TC-AUTH-12 | Return to the page after sign-in | Signed out, open `/invite/<id>` on the web → sign in | Back on the invite page | Web | Manual (see [web.md](web.md)) |

## 2. Account deletion (FR-010)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-ACC-01 | Delete email account | Settings → *Delete account* → enter password → *Delete account* | Sign in screen; owned purifiers with filters, history, invites, legacy history and the Auth account are gone; removed from shared purifiers | Both | UI: `AccountDeletionUITests`; web e2e (manual) |
| TC-ACC-02 | Wrong password | Same, with a wrong password | Error; nothing deleted (web shows "Invalid email or password"; iOS shows an alert) | Both | Manual on iOS; web e2e (manual) |
| TC-ACC-03 | Cancel | Open the delete alert → *Cancel* | Nothing happens | Both | Manual |
| TC-ACC-04 | Google account | Signed in with Google → Delete account → Google sheet → confirm | Account deleted | Both | Manual (real account) |
| TC-ACC-05 | Apple account | Signed in with Apple → Delete account → confirm → Apple sheet | Account deleted; Apple token revoked (Settings › Apple ID › Sign in with Apple no longer lists the app) | iOS | Manual (device) |
| TC-ACC-06 | Apple account on the web | Apple-only account on the web → avatar menu → Delete account | Message pointing to the iOS app; button disabled | Web | Manual |

## 3. Purifiers (FR-002, FR-003)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-PUR-01 | Empty state | New account → Dashboard and Purifiers tabs | "No purifiers yet" with an add button | Both | UI: `FunctionalUITests.testSignUpShowsEmptyDashboard` |
| TC-PUR-02 | Model picker | Purifiers → + → *Add purifier* → *Purifier type* | Models grouped by brand: Kangaroo, Karofi, Sunhouse, Hòa Phát, Toshiba, Mutosi, A. O. Smith (42) | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier`; Unit: `PurifierTypeCatalogTests` |
| TC-PUR-03 | Filter preview | Choose *Kangaroo - KG102 (5 filters)* | Filters section lists 5 filters with intervals | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier` |
| TC-PUR-04 | Save needs name and model | Leave name empty or no model chosen | *Save* disabled | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier` |
| TC-PUR-05 | Create purifier | Name "Test purifier", location, model KG102 → *Save* | Appears at the top of Purifiers; detail shows the model and 5 filters, each last replaced on the installation date; History has "Purifier added" | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier` |
| TC-PUR-06 | Installation date in the past | Set the installation date 4 months ago | Filters with 3-month intervals show Expired | Both | Manual |
| TC-PUR-07 | Edit purifier | Detail → ••• → *Edit* → change name and location → *Save* | Detail and list show the new values | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier` |
| TC-PUR-08 | Delete purifier | Detail → ••• → *Delete purifier* → *Delete* | Gone from the list; its filters, history and invites deleted | Both | UI: `FunctionalUITests.testCreateEditAndDeletePurifier`; Rules |
| TC-PUR-09 | Catalog data | — | Unique ids, both languages, positions 1…n, intervals > 0 | Both | Unit: `PurifierTypeCatalogTests` |
| TC-PUR-10 | Field limits | Web: name > 100, location > 200, notes > 500 characters | Validation message | Web | Manual |

## 4. Filters and status (FR-004)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-FIL-01 | Status rule | — | > 30 days OK, 1–30 due soon, ≤ 0 expired; month-end clamping; partial days count as 0 | Both | Unit: `FilterStatusCalculatorTests` |
| TC-FIL-02 | Filter rows | Open a purifier | Each filter shows interval, last replaced, next replacement, days text and a status badge, most urgent first | Both | UI: `FunctionalUITests.testReplaceFilterUpdatesStatusAndHistory` |
| TC-FIL-03 | Replace a filter | *Replace* on a due-soon filter → keep today → notes → *Replace* | Badge becomes OK; last replaced = today; History shows "Filter replaced … by <you>" | Both | UI: `FunctionalUITests.testReplaceFilterUpdatesStatusAndHistory`, `SharingUITests.testEditorReplacesFilterAndHistoryShowsWhoDidIt` |
| TC-FIL-04 | Replacement date limits | Replace → pick a date | iOS: today or earlier only; web: any date | Both | Manual |
| TC-FIL-05 | Cancel replacement | Replace → *Cancel* | Nothing changes | Both | Manual |

## 5. Dashboard (FR-006)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-DSH-01 | Statistics | Sign in as Alice | Purifiers 1, Filters 2, Needs attention 1, Filters OK 1 | Both | UI: `FunctionalUITests.testDashboardShowsStatistics` |
| TC-DSH-02 | Attention list | Same | Lists the due-soon filter with its purifier; tapping it opens the purifier | Both | UI: `FunctionalUITests.testDashboardShowsStatistics` |
| TC-DSH-03 | All OK | Account whose filters are all OK | "All filters are OK" (web: no attention lists) | Both | Manual |
| TC-DSH-04 | Shared purifiers count | Sign in as Bob | Kitchen purifier counts in the statistics | Both | Manual |
| TC-DSH-05 | Email invites | Verified invitee with a pending email invite | "Invites for you" with Accept / Decline | Both | Manual (needs a verified email, see [test data](test-data.md)) |

## 6. History (FR-004, FR-009)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-HIS-01 | Entries | History tab | Newest first; type, purifier, filter, "by <name>", date | Both | UI: `FunctionalUITests.testReplaceFilterUpdatesStatusAndHistory` |
| TC-HIS-02 | Members see owner's history | Bob → History | Entries for the shared purifier, including Alice's | Both | UI: `SharingUITests.testEditorReplacesFilterAndHistoryShowsWhoDidIt` |
| TC-HIS-03 | Legacy history | Alice (seed has two legacy entries) → History | Legacy entries appear once, not duplicated | Both | Manual (web e2e checked during the migration) |
| TC-HIS-04 | Empty | New account → History | "No history yet" | Both | UI: `FunctionalUITests.testSignUpShowsEmptyDashboard` |
| TC-HIS-05 | Refresh | Pull to refresh (iOS) / reopen the page (web) | New entries appear | Both | Manual |

## 7. Reminders (FR-005)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-REM-01 | Permission prompt | First sign-in | iOS asks to allow notifications | iOS | UI: handled by `launchSignedIn` |
| TC-REM-02 | Settings status | Settings → Reminders | "Reminders are on" when allowed; "Turn on reminders in Settings" when denied | iOS | UI: `FunctionalUITests.testSettingsShowsAccountAndLinks` |
| TC-REM-03 | Reminder delivery | Purifier with a filter due in 7 days → wait until 09:00 (or change the device date) | "Filter replacement coming up" notification; on the due date "Time to replace a filter" | iOS | Manual (device) |
| TC-REM-04 | Rescheduling | Replace that filter | Its pending reminders move to the new due date | iOS | Manual |
| TC-REM-05 | Removed on sign-out | Sign out | No pending reminders | iOS | Manual |

## 8. Sharing (FR-009)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-SHR-01 | Create a link invite | Owner → detail → ••• → *Share* → role Viewer → *Create invite link* | Share sheet opens; "Pending invites" lists "Anyone with the link · Viewer · Expires …" | Both | UI: `FunctionalUITests.testOwnerCreatesAndRevokesInvite` |
| TC-SHR-02 | Create an email invite | Same with an email | Pending invite shows the email | Both | Manual |
| TC-SHR-03 | Revoke an invite | Pending invite → *Revoke* | Removed from the list; the link no longer works | Both | UI: `FunctionalUITests.testOwnerCreatesAndRevokesInvite`; Rules |
| TC-SHR-04 | Join with a link | Dave → Purifiers → + → *Join with invite link* → paste → *Accept invite* | Purifier listed as "Shared · Viewer" | Both | UI: `SharingUITests.testJoinWithInviteLink` |
| TC-SHR-05 | Invalid link | Paste a revoked or unknown link | "This invite doesn't exist or was revoked." | Both | Manual |
| TC-SHR-06 | Accept an email invite | Verified invitee → Dashboard → *Accept* | Becomes a member with the invite's role | Both | Manual |
| TC-SHR-07 | Decline an email invite | Same → *Decline* | Invite disappears | Both | Manual |
| TC-SHR-08 | Change a member's role | Owner → Share → member's role → Viewer | Member's role changes; they lose the Replace buttons | Both | UI: `FunctionalUITests.testOwnerChangesRoleAndRemovesMember` |
| TC-SHR-09 | Remove a member | Owner → Share → member → *Remove* → confirm | Member no longer listed; the purifier disappears for them | Both | UI: `FunctionalUITests.testOwnerChangesRoleAndRemovesMember` |
| TC-SHR-10 | Leave | Member → detail → ••• → *Leave* → confirm | Purifier gone from their list; owner's member list updates | Both | UI: `FunctionalUITests.testMemberLeavesSharedPurifier` |
| TC-SHR-11 | Editor permissions | Bob (editor) | Can edit details and replace filters; no Share or Delete | Both | UI: `SharingUITests.testEditorReplacesFilterAndHistoryShowsWhoDidIt`; Rules |
| TC-SHR-12 | Viewer permissions | Carol (viewer) | View-only footer; no Replace or Edit | Both | UI: `SharingUITests.testViewerCannotReplaceFilters`; Rules |
| TC-SHR-13 | Shared by | Member → detail | "Shared by Alice", "Your role" | Both | UI: `SharingUITests.testEditorReplacesFilterAndHistoryShowsWhoDidIt` |
| TC-SHR-14 | Security boundary | — | Every allow/deny in the access matrix | — | Rules: all 37 tests |

## 9. Settings, legal pages and language (FR-008, FR-010)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-SET-01 | Account info | Settings | Name and email of the signed-in user; Version 1.0 | iOS | UI: `FunctionalUITests.testSettingsShowsAccountAndLinks` |
| TC-SET-02 | Privacy and support links | Settings → *Privacy Policy* / *Support* | Open `/privacy` and `/support` on the web app | iOS | UI: `FunctionalUITests.testSettingsShowsAccountAndLinks` (links present); Manual (Safari opens) |
| TC-SET-03 | Legal pages signed out | Open `/privacy`, `/support` without signing in; links on the sign-in page | Pages render in both languages | Web | Manual (checked with puppeteer during development) |
| TC-I18N-01 | Vietnamese UI | iPhone language Vietnamese (or per-app language) → open the app | Tabs "Tổng quan", "Máy lọc", "Lịch sử", "Cài đặt"; dates in Vietnamese | iOS | UI: `FunctionalUITests.testVietnameseInterface`, `ScreenshotTests` |
| TC-I18N-02 | Web language switcher | Header → switch language → reload | Language kept; first visit follows the browser, falling back to Vietnamese | Web | Manual |
| TC-I18N-03 | Change language shortcut | Settings → *Change language* | Opens iOS Settings for the app | iOS | Manual |

## 10. Data sync (FR-007)

| ID | Case | Steps | Expected | Platform | Automated by |
|----|------|-------|----------|----------|--------------|
| TC-SYN-01 | Real-time across devices | Same account on web and iOS → replace a filter on one | The other updates without reloading | Both | Manual |
| TC-SYN-02 | Members see changes | Bob replaces a filter | Alice's screens update | Both | Manual |
| TC-SYN-03 | Offline on iOS | Airplane mode → replace a filter → back online | Change shown immediately and synced later | iOS | Manual (device) |

---

## Results of the last run

Run on 2026-10-24, iPhone 15 Pro simulator (iOS 17.5), emulators, main @ `4cc556f` plus this change.

| Suite | Tests | Result |
|-------|-------|--------|
| iOS unit (`FilterStatusCalculatorTests`, `PurifierTypeCatalogTests`, `SharingTests`) | 26 | ✅ All passed |
| `FunctionalUITests` | 13 | ✅ All passed |
| `AccountDeletionUITests` | 1 | ✅ Passed |
| `SharingUITests` | 3 | ✅ All passed |
| `ScreenshotTests` | 1 | Skipped (runs only on request) |
| Firestore rules | 37 | ✅ All passed |
| Web build and lint | — | ✅ 0 errors (4 existing warnings) |

**Bug found by TC-PUR-05 and fixed:** on iOS, a purifier created on the device showed no filters (and no dashboard counts or reminders for them) until the app was relaunched. Its filters listener started from the local, not yet committed purifier, so the rules denied it, and a failed Firestore listener never restarts. `PurifierStore` now listens again with a short backoff when a filters listener fails.

Cases marked **Manual** were not run; they need real Google/Apple accounts, a physical device, a verified email, or the web app.

## Related

- Strategy → [strategy.md](strategy.md) · iOS tests → [ios.md](ios.md) · Web → [web.md](web.md) · Data → [test-data.md](test-data.md)
- Requirements → [`../02-requirements/functional/`](../02-requirements/functional/README.md)
