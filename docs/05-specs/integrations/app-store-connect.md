# App Store Connect / TestFlight

**Last Updated**: 2026-10-17

## Purpose

Distributes iOS builds to testers through TestFlight (App Store release later).

## Configuration

| Item | Value |
|------|-------|
| Apple account | The owner's personal Apple Developer account, team `HH22B576H5` — not the company team that is also in Xcode |
| Bundle id | `com.nguyenduyhust.waterpurifiermanager` |
| App record | Created in App Store Connect; primary language Vietnamese |
| Signing | Automatic (`-allowProvisioningUpdates`) |
| Export compliance | `ITSAppUsesNonExemptEncryption = NO` (HTTPS only), so uploads skip the questionnaire |
| Versions | `MARKETING_VERSION` 0.1.0; `CURRENT_PROJECT_VERSION` must increase on every upload |

## Uploads so far

| Build | Date | Notes |
|-------|------|-------|
| 0.1.0 (1) | 2026-10-17 | First upload, placeholder icon |
| 0.1.0 (2) | 2026-10-17 | Final icon and logo, Google "G" button |

Build 3 (sharing) is pending — see [deployment](../../07-operations/deployment.md#ios-testflight).

## Notes

- Uploads warn about missing dSYMs for Firebase's prebuilt binaries (FirebaseFirestoreInternal, absl, grpc, openssl_grpc). Harmless; crash reports inside those frameworks won't be symbolicated.
- Internal testers need no review; external testers need Beta App Review.

## Related

- Sign in with Apple → [sign-in-with-apple.md](sign-in-with-apple.md)
- Deployment → [`../../07-operations/deployment.md`](../../07-operations/deployment.md#ios-testflight)
