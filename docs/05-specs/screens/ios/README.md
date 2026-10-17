# iOS Screens

**Last Updated**: 2026-10-17

SwiftUI screens in `ios/WaterPurifierManager/Features/`. Signed-in users see a tab bar: **Dashboard · Purifiers · History · Settings**, each tab with its own navigation stack. Text is localized (English / Vietnamese); labels below are the English ones.

| Id | Screen | Entry point | File |
|----|--------|-------------|------|
| [I-01](sign-in.md) | Sign in | Launch while signed out | `Auth/SignInView.swift` |
| [I-02](sign-up.md) | Sign up | I-01 › Sign up | `Auth/SignUpView.swift` |
| [I-03](forgot-password.md) | Reset password | I-01 › Forgot password? | `Auth/ForgotPasswordView.swift` |
| [I-04](dashboard.md) | Dashboard | Tab | `Dashboard/DashboardView.swift` |
| [I-05](purifiers.md) | Purifiers | Tab | `Purifiers/PurifierListView.swift` |
| [I-06](purifier-detail.md) | Purifier detail | I-04, I-05 | `Purifiers/PurifierDetailView.swift` |
| [I-07](purifier-form.md) | New / edit purifier | Sheet | `Purifiers/PurifierFormView.swift` |
| [I-08](replace-filter.md) | Replace filter | Sheet from I-06 | `Purifiers/ReplaceFilterSheet.swift` |
| [I-09](share.md) | Share | Sheet from I-06 | `Sharing/SharingViews.swift` (`ShareView`) |
| [I-10](join-invite.md) | Join a purifier | Sheet from I-05 | `Sharing/SharingViews.swift` (`JoinInviteView`) |
| [I-11](history.md) | History | Tab | `History/HistoryView.swift` |
| [I-12](settings.md) | Settings | Tab | `Settings/SettingsView.swift` |

If `GoogleService-Info.plist` is missing, the app shows a single "Firebase is not configured" screen (`App/RootView.swift`).

## Related

- App structure → [`../../../03-architecture/ios.md`](../../../03-architecture/ios.md)
- Web equivalents → [`../README.md`](../README.md#equivalents)
