# Non-Functional Requirements

**Last Updated**: 2026-10-17

Quality targets for the system. Targets marked *not measured* have no tooling or monitoring behind them yet; treat them as goals, not guarantees.

## Performance

| Requirement | Target | Status |
|-------------|--------|--------|
| Initial page load (web) | < 3 s on a typical connection | Not measured. The production bundle is a single ~1.1 MB JS chunk (~300 kB gzip); Vite warns about its size |
| Firestore read latency | < 500 ms | Not measured (Firebase-managed) |
| Realtime propagation | A change on one device visible on others within a few seconds | Observed in testing |
| UI responsiveness | 60 fps | Not measured |

## Reliability

- **Availability** depends on Firebase (Auth, Firestore) and Vercel; the apps have no other runtime dependencies.
- **Durability** is Firestore's. No backups are configured — see [backup](../07-operations/backup.md).
- **Offline**: iOS works offline from the Firestore cache; the web app needs a connection ([FR-007](functional/data-sync.md)).
- **Data consistency**: a purifier and its filters are created in one batch; joining a shared purifier is one batch verified by rules. A filter replacement updates the filter and then writes a log; if the second write fails, the filter is updated without a log entry.

## Security

See [`../08-security/`](../08-security/README.md). In short: every read and write is checked by Firestore rules; no secrets are committed.

## Accessibility

| Item | Status |
|------|--------|
| Semantic controls (real buttons, links, labels) | Web uses shadcn/ui (Radix) components; iOS uses standard SwiftUI controls |
| Icon-only buttons labelled | Partly — the web share dialog labels them; review the rest |
| Color is not the only status signal | Status badges include text ("OK", "Due soon", "Expired") |
| Dynamic Type (iOS) | Supported by system fonts; not audited |
| WCAG 2.1 AA, keyboard navigation, screen readers | Not audited |

## Platform support

| Platform | Support |
|----------|---------|
| Browsers | Current Chrome, Safari, Firefox, Edge; Google sign-in falls back to redirect in in-app browsers (Zalo, Facebook, …) |
| Web layouts | Responsive: sidebar collapses to a menu on small screens |
| iOS | iOS 17+, iPhone, portrait |
| Android | Not supported |

## Cost

The system should run within Firebase's free tier for household-scale usage. History reads fetch up to 50 entries per accessible purifier each time the History screen opens.

## Related

- Constraints → [constraints.md](constraints.md)
- Monitoring → [`../07-operations/monitoring.md`](../07-operations/monitoring.md)
