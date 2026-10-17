# 05 · Specifications

**Last Updated**: 2026-10-17

Contract-level specs: the exact data the apps store, the screens they show and the external systems they talk to. The app has no API of its own; its "API" is the Firestore schema plus the security rules.

| Folder / file | Contents |
|---------------|----------|
| [database/](database/README.md) | One file per Firestore collection |
| [purifier-types.md](purifier-types.md) | The bundled purifier catalog (`shared/purifier-types.json`) |
| [screens/](screens/README.md) | One file per screen, web and iOS |
| [integrations/](integrations/README.md) | One file per external system |
