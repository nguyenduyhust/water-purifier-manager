# Water Purifier Manager — iOS

Native SwiftUI app. It talks to the same Firebase project and Firestore schema as the web app in `../web`, so a user sees the same purifiers on both.

- iOS 17+, iPhone, Swift 5 language mode
- Firebase Auth (email/password, Google, Sign in with Apple) and Firestore via Swift Package Manager
- Purifier models come from `../shared/purifier-types.json`, bundled at build time
- Filter reminders are local notifications scheduled on the device (7 days before and on the due date, 9:00)

## Setup

1. Open `WaterPurifierManager.xcodeproj` in Xcode 26 or later. Packages resolve on first open.
2. Download `GoogleService-Info.plist` for the iOS app from the Firebase console (Project settings → Your apps) and put it in `WaterPurifierManager/`. It is git-ignored.
3. Copy `Config/Firebase.xcconfig.example` to `Config/Firebase.xcconfig` and set `GOOGLE_REVERSED_CLIENT_ID` to the `REVERSED_CLIENT_ID` value from the plist. Google Sign-In needs it as a URL scheme.
4. Select your team under Signing & Capabilities to run on a device. Sign in with Apple requires a paid Apple Developer account.

Without the plist the app launches into a "Firebase is not configured" screen instead of crashing.

### Firebase console

- **Authentication → Sign-in method:** Email/Password, Google and Apple must be enabled.
- Apple sign-in for native iOS only needs the provider enabled; the Services ID and key are only required for web.

## Build and test from the command line

```bash
xcodebuild -project WaterPurifierManager.xcodeproj -scheme WaterPurifierManager \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' test
```

## Structure

```
WaterPurifierManager/
├── App/          # Entry point, Firebase bootstrap, root and tab views
├── Models/       # Firestore documents (Purifier, Filter, ActivityLog)
├── Domain/       # FilterStatusCalculator, PurifierTypeCatalog — no Firebase
├── Services/     # Firestore repositories, notifications, auth helpers
├── Stores/       # @Observable state: AuthSession, PurifierStore, HistoryStore
├── Features/     # SwiftUI screens by feature
├── Shared/       # Small view helpers
└── Resources/    # Assets, Localizable.xcstrings (en, vi), InfoPlist.xcstrings
Config/           # Info.plist, entitlements, xcconfig
```

The project uses synchronized folders: files added under `WaterPurifierManager/` or `WaterPurifierManagerTests/` join their target automatically, no project file edits needed.

## Keeping parity with the web app

- `Domain/FilterStatus.swift` mirrors `web/src/services/filter-status-service.ts` (ok > 30 days, warning 1–30, expired ≤ 0). Change both together; the unit tests pin the behavior.
- Repositories write the same fields as `web/src/services/*-service.ts`, including `null` for missing optional activity log fields.
- UI strings live in `Resources/Localizable.xcstrings`; Vietnamese wording follows `web/src/i18n/locales/vi.json`.
