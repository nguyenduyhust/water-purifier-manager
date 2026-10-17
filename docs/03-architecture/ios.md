# iOS App Architecture

**Last Updated**: 2026-10-17

The iOS app (`ios/`) is a native SwiftUI app for iPhone (iOS 17+). It mirrors the web app's behavior and Firestore schema and adds local reminders. The Xcode project uses synchronized folders, so files added under `WaterPurifierManager/` or the test folders join their target without project-file edits.

## Layers

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| App | `App/` | `@main` entry, Firebase bootstrap (incl. debug emulator mode), `AppDelegate` (notification presentation), `RootView`, `MainTabView` |
| Features | `Features/` | SwiftUI screens: `Auth/`, `Dashboard/`, `Purifiers/`, `Filters/`, `History/`, `Settings/`, `Sharing/` |
| Stores | `Stores/` | `@Observable @MainActor` state: `AuthSession`, `PurifierStore`, `HistoryStore`, `MyInvitesStore`, `PurifierSharingModel` |
| Services | `Services/` | Firestore repositories (`PurifierRepository`, `ActivityLogRepository`, `SharingRepository`), `NotificationScheduler`, `AppleSignInNonce`, `AuthErrorMessage` |
| Models | `Models/` | Codable Firestore documents: `Purifier`, `Filter`, `FilterItem`, `ActivityLog`, `Invite`; roles (`MemberRole`, `AccessRole`) |
| Domain | `Domain/` | Pure logic, no Firebase: `FilterStatusCalculator`, `PurifierTypeCatalog` |
| Shared | `Shared/` | View helpers (`errorAlert`, navigation route) |
| Resources | `Resources/` | Assets (app icon incl. dark variant, logo, Google logo), `Localizable.xcstrings`, `InfoPlist.xcstrings` |
| Config | `../Config/` | `Info.plist` additions, entitlements (Sign in with Apple), `App.xcconfig` (+ git-ignored `Firebase.xcconfig`) |

`shared/purifier-types.json` is added to the app target as a resource straight from the repo's `shared/` folder.

## App structure

```
WaterPurifierManagerApp
└── RootView                         switches on AuthSession.state
    ├── SignInView (signed out)
    └── MainTabView(user)            creates PurifierStore, HistoryStore, MyInvitesStore
        ├── Dashboard   (NavigationStack)
        ├── Purifiers   (NavigationStack)
        ├── History     (NavigationStack)
        └── Settings    (NavigationStack)
```

`MainTabView` is keyed by user id, so signing in as someone else rebuilds every store. Stores are passed down with `.environment(...)`.

## State and data flow

- **AuthSession** listens to `Auth.auth().addStateDidChangeListener` and exposes `.loading / .signedOut / .signedIn(AuthUser)`.
- **PurifierStore** subscribes to owned purifiers (`userId ==`) and shared purifiers (`memberIds array-contains`), merges them, and keeps one filter listener per purifier. Filter items carry a computed `FilterSchedule`; `now` refreshes when the app becomes active. After each change it reschedules reminders (debounced 500 ms).
- **HistoryStore** fetches up to 50 entries from every accessible purifier's `logs` plus legacy `activityLogs`, de-duplicated by id. It reloads when the History tab appears and when the purifier list changes.
- **MyInvitesStore** listens for pending email invites when the user's email is verified.
- **PurifierSharingModel** (owner's Share screen) listens to that purifier's pending invites.

Snapshot callbacks arrive on the main queue and are applied with `MainActor.assumeIsolated`.

## Reminders

`NotificationScheduler` removes the app's pending requests and re-adds up to 60 calendar notifications (7 days before and on the due date at 09:00). See [reminders](../02-requirements/functional/reminders.md).

## Debug-only launch arguments

| Argument | Effect |
|----------|--------|
| `-useFirebaseEmulators` | Uses the demo project `demo-water-purifier` and the local Auth (9099) and Firestore (8080) emulators, memory cache |
| `-signOutOnLaunch` | With the above, signs out at launch so tests start at sign-in |

Both are compiled out of Release builds.

## Related

- Web counterpart → [web.md](web.md)
- Setup and parity rules → [`../../ios/README.md`](../../ios/README.md)
- Screens → [`../05-specs/screens/ios/`](../05-specs/screens/ios/README.md)
- ADR → [ADR-0008](../09-decisions/0008-native-swiftui-ios-app.md)
