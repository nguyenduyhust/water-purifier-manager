# iOS Tests

**Last Updated**: 2026-10-17

## Unit tests (`WaterPurifierManagerTests`, Swift Testing)

| Suite | Covers |
|-------|--------|
| `FilterStatusCalculatorTests` | Next date (incl. month-end clamping), ok/warning/expired boundaries (31, 30, 1, 0 days), partial days counting as 0 like date-fns, overdue negatives, urgency sorting. Expected values were computed with the web's date-fns. |
| `PurifierTypeCatalogTests` | The bundled catalog loads; unique ids; both languages; positions 1…n; positive intervals; brand grouping |
| `SharingTests` | Access roles (owner, editor, viewer, unknown role → none), `canEdit`, invite problems (link, case-insensitive email, wrong/unverified email, expired, used, declined, own), invite link parsing and building |

Unit tests run in the app host and don't need Firebase.

## UI tests (`WaterPurifierManagerUITests`, XCTest)

`SharingUITests` drives the app against the local emulators:

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
- Tests mutate data (replace a filter, accept the invite); reseed before re-running.

## Related

- Test data → [test-data.md](test-data.md)
- iOS architecture → [`../03-architecture/ios.md`](../03-architecture/ios.md)
