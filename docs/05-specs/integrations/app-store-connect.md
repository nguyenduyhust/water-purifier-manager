# App Store Connect / TestFlight

**Last Updated**: 2026-10-19

## Purpose

Distributes iOS builds to testers through TestFlight and publishes the app on the App Store.

## Configuration

| Item | Value |
|------|-------|
| Apple account | The owner's personal Apple Developer account, team `HH22B576H5` — not the company team that is also in Xcode |
| Bundle id | `com.nguyenduyhust.waterpurifiermanager` |
| App record | "Water Purifier Manager", Apple ID `6823695333`, SKU `water-purifier-manager`; primary language English (U.S.), Vietnamese localization |
| Signing | Automatic (`-allowProvisioningUpdates`) |
| Export compliance | `ITSAppUsesNonExemptEncryption = NO` (HTTPS only), so uploads skip the questionnaire |
| Versions | `MARKETING_VERSION` must match the App Store version (1.0); `CURRENT_PROJECT_VERSION` must increase on every upload |
| API access | App Store Connect API key `8GCF994QJH` (App Manager), stored only in `~/.appstoreconnect/private_keys/` on the owner's Mac |

## Uploads so far

| Build | Date | Notes |
|-------|------|-------|
| 0.1.0 (1) | 2026-10-17 | First upload, placeholder icon |
| 0.1.0 (2) | 2026-10-17 | Final icon and logo, Google "G" button |
| 0.1.0 (3) | 2026-10-17 | Sharing |
| 0.1.0 (4) | 2026-10-17 | 42-model catalog |
| 0.1.0 (5) | 2026-10-17 | Account deletion, privacy policy and support links |
| 1.0 (6) | 2026-10-19 | First App Store submission |

## App Store listing

- Category Utilities (secondary Lifestyle), free, age rating 4+.
- Privacy policy `https://water-purifier-manager.vercel.app/privacy`, support `…/support` ([FR-010](../../02-requirements/functional/authentication.md)).
- Screenshots (iPhone 6.9", en and vi) come from `ScreenshotTests` with `firebase/scripts/seed-screenshots.mjs` — see that test's header.
- App Review signs in with a demo account on production (`nguyenduy.hust+appreview@gmail.com`); its password is only in the review notes in App Store Connect. App Privacy answers: Contact Info (name, email), User Content, User ID — app functionality, linked to the user, no tracking.

## Notes

- Uploads warn about missing dSYMs for Firebase's prebuilt binaries (FirebaseFirestoreInternal, absl, grpc, openssl_grpc). Harmless; crash reports inside those frameworks won't be symbolicated.
- Internal testers need no review; external testers need Beta App Review.

## Related

- Sign in with Apple → [sign-in-with-apple.md](sign-in-with-apple.md)
- Deployment → [`../../07-operations/deployment.md`](../../07-operations/deployment.md#ios-testflight)
