# I-12 · Settings

| | |
|---|---|
| **Entry** | Settings tab |
| **File** | `Features/Settings/SettingsView.swift` |

## Layout

```
Settings
ACCOUNT
 Name      Alice
 Email     alice@example.com
REMINDERS
 🔔 Reminders are on                 | Turn on reminders | Turn on reminders in Settings
 You'll be reminded 7 days before and on the day each filter is due, at 9:00.
LANGUAGE
 Change language                     → iOS Settings for this app
 The app follows your iPhone's language. You can choose a different language
 for this app in Settings.
 Sign out                            (red, confirmation)
 Delete account                      (red)
 Permanently deletes your account, the purifiers you own and their history.
 You are removed from purifiers shared with you.
 Privacy Policy                      → web /privacy
 Support                             → web /support
 Version   0.1.0
```

## Actions

| Element | Action |
|---------|--------|
| Turn on reminders | Requests notification permission, then schedules reminders |
| Turn on reminders in Settings | Opens iOS Settings (permission denied) |
| Change language | Opens iOS Settings for the app |
| Sign out | Confirmation; signs out of Firebase and Google; removes pending reminders |
| Delete account | Email accounts: one alert with the warning and a password field. Google/Apple: a confirmation dialog, then the provider's sign-in sheet. Then deletes data and account ([FR-010](../../../02-requirements/functional/authentication.md)) |
| Privacy Policy / Support | Open the web pages in Safari |

## Related

- Requirements → [FR-005](../../../02-requirements/functional/reminders.md), [FR-008](../../../02-requirements/functional/i18n.md), [FR-010](../../../02-requirements/functional/authentication.md)
