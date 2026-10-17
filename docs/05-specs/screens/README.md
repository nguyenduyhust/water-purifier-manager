# Screens

**Last Updated**: 2026-10-17

One file per screen or dialog. Screen ids are stable: `W-xx` for the web app, `I-xx` for iOS. Each spec gives the route or entry point, who can see it, a layout sketch and the actions, and links to the requirement it implements.

| Platform | Index |
|----------|-------|
| Web | [web/README.md](web/README.md) |
| iOS | [ios/README.md](ios/README.md) |

## Equivalents

| Purpose | Web | iOS |
|---------|-----|-----|
| Sign in | [W-01](web/sign-in.md) | [I-01](ios/sign-in.md) |
| Sign up | [W-02](web/sign-up.md) | [I-02](ios/sign-up.md) |
| Forgot password | [W-03](web/forgot-password.md) | [I-03](ios/forgot-password.md) |
| Dashboard | [W-04](web/dashboard.md) | [I-04](ios/dashboard.md) |
| Purifier list | [W-05](web/purifiers.md) | [I-05](ios/purifiers.md) |
| New / edit purifier | [W-06](web/purifier-new.md), [W-08](web/purifier-edit.md) | [I-07](ios/purifier-form.md) |
| Purifier detail | [W-07](web/purifier-detail.md) | [I-06](ios/purifier-detail.md) |
| Replace filter | [W-09](web/replace-filter-dialog.md) | [I-08](ios/replace-filter.md) |
| Share | [W-10](web/share-dialog.md) | [I-09](ios/share.md) |
| Accept invite | [W-11](web/invite.md) | [I-10](ios/join-invite.md) |
| History | [W-12](web/history.md) | [I-11](ios/history.md) |
| Settings | Header language switcher, avatar menu | [I-12](ios/settings.md) |

## Shared conventions

- Destructive actions (delete, leave, remove member) ask for confirmation.
- Errors appear as toasts (web) or alerts (iOS) with a short, translated message.
- Status badge colors: green OK, orange/yellow due soon, red expired.
- Actions a user's role doesn't allow are hidden, not disabled.
