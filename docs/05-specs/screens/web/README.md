# Web Screens

**Last Updated**: 2026-10-17

Screens of the React app in `web/src/pages/` and the dialogs they open. Signed-in screens share the app shell: a sidebar (Dashboard, Purifiers, History) with the app logo, and a header with the language switcher (Tiếng Việt / English) and the avatar menu (Sign out). On small screens the sidebar becomes a slide-in menu.

| Id | Screen | Route |
|----|--------|-------|
| [W-01](sign-in.md) | Sign in | `/login` |
| [W-02](sign-up.md) | Sign up | `/register` |
| [W-03](forgot-password.md) | Forgot password | `/forgot-password` |
| [W-04](dashboard.md) | Dashboard | `/` |
| [W-05](purifiers.md) | Purifier list | `/purifiers` |
| [W-06](purifier-new.md) | New purifier | `/purifiers/new` |
| [W-07](purifier-detail.md) | Purifier detail | `/purifiers/:id` |
| [W-08](purifier-edit.md) | Edit purifier | `/purifiers/:id/edit` |
| [W-09](replace-filter-dialog.md) | Replace filter (dialog) | on W-07 |
| [W-10](share-dialog.md) | Share (dialog) | on W-07 |
| [W-11](invite.md) | Accept invite | `/invite/:inviteId` |
| [W-12](history.md) | History | `/history` |

## Related

- Routing and layers → [`../../../03-architecture/web.md`](../../../03-architecture/web.md)
