# iOS Tests

**Last Updated**: 2026-10-23

## Unit tests (`WaterPurifierManagerTests`, Swift Testing)

| Suite | Covers |
|-------|--------|
| `FilterStatusCalculatorTests` | Next date (incl. month-end clamping), ok/warning/expired boundaries (31, 30, 1, 0 days), partial days counting as 0 like date-fns, overdue negatives, urgency sorting. Expected values were computed with the web's date-fns. |
| `PurifierTypeCatalogTests` | The bundled catalog loads; unique ids; both languages; positions 1…n; positive intervals; brand grouping |
| `SharingTests` | Access roles (owner, editor, viewer, unknown role → none), `canEdit`, invite problems (link, case-insensitive email, wrong/unverified email, expired, used, declined, own), invite link parsing and building |

Unit tests run in the app host and don't need Firebase.

## UI tests (`WaterPurifierManagerUITests`, XCTest)

All UI tests drive the app against the local emulators. Test case ids refer to [test-cases.md](test-cases.md).

| Suite | Data | Covers |
|-------|------|--------|
| `FunctionalUITests` | Creates its own users and documents through the emulators' REST API (`EmulatorData`) | Sign up, sign-up validation, wrong password, forgot password, sign out; create, edit and delete a purifier; replace a filter and see history; dashboard statistics; settings; Vietnamese UI; create and revoke an invite; change a member's role and remove them; leave a shared purifier |
| `AccountDeletionUITests` | Own user and data | Delete account: owned data, membership, invites, legacy history and the Auth account are gone |
| `SharingUITests` | Seed (`seed-sharing.mjs`) | The three journeys below |
| `ScreenshotTests` | `seed-screenshots.mjs`; runs only with `TEST_RUNNER_SCREENSHOT_LANG=en|vi` | App Store screenshots |

`SharingUITests`:

| Test | Journey |
|------|---------|
| `testEditorReplacesFilterAndHistoryShowsWhoDidIt` | Bob signs in → sees "Shared · Editor" → opens the purifier → replaces a filter → History shows "by Bob" |
| `testViewerCannotReplaceFilters` | Carol signs in → "Shared · Viewer" → detail shows the view-only footer and no Replace buttons |
| `testJoinWithInviteLink` | Dave pastes the invite link → accepts → purifier appears as "Shared · Viewer" |

The app is launched with `-useFirebaseEmulators -signOutOnLaunch` and English locale. Tests skip themselves when the Firestore emulator isn't reachable, so a plain `xcodebuild test` still passes.

### Run

```bash
cd firebase
npx firebase emulators:start --only auth,firestore --project demo-water-purifier   # keep running
node scripts/seed-sharing.mjs                                                       # before each run

cd ../ios
xcodebuild -project WaterPurifierManager.xcodeproj -scheme WaterPurifierManager \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -only-testing:WaterPurifierManagerUITests test
```

### Gotchas

- After sign-in iOS may show **"Save Password?"** and the notification permission alert; both swallow taps. The tests dismiss them ("Not Now", "Allow") before continuing.
- `SharingUITests` mutates the seed (replaces a filter, accepts the invite); reseed before re-running. The other suites create their own data.
- Run with `-parallel-testing-enabled NO`: parallel clones share the emulators and the seed.
- iOS's strong password suggestion takes over the sign-up password fields and swallows typing. Debug builds launched with `-useFirebaseEmulators` mark those fields as one-time codes, which never get a suggestion.
- Fields with a `prompt` are found by their placeholder (`app.textFields["e.g. Kitchen purifier"]`), `LabeledContent` reads as one label (`"Name, Uma"`), list section headers are upper case, and headers in a navigation-link picker are buttons.
- A multi-line `TextField` sometimes doesn't take focus from an element tap; the tests tap its leading edge by coordinate.
- `FunctionalUITests` attaches a screenshot and the view hierarchy to every failure; export them with `xcrun xcresulttool export attachments --path <result>.xcresult --output-path <dir> --only-failures`.

## Related

- Test data → [test-data.md](test-data.md)
- iOS architecture → [`../03-architecture/ios.md`](../03-architecture/ios.md)
