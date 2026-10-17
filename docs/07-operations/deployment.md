# Deployment

**Last Updated**: 2026-10-17

Three things get deployed independently: Firestore rules and indexes, the web app, and iOS builds. They share one database, so **order matters** whenever rules or the schema change.

## Release order

1. **Firestore rules and indexes** — first. New rules must still accept everything the currently released web app and iOS builds send. Wait for new indexes to finish building.
2. **Data migrations**, if any ([data-migrations.md](data-migrations.md)). Must be safe for both old and new clients.
3. **Web** — merge the PR; Vercel deploys `main`.
4. **iOS** — upload a new TestFlight build.
5. **Follow-up migration runs** if old clients may have written data in the old shape meanwhile.

Example (sharing, October 2026): rules + indexes deployed → history migrated → PR #3 merged → iOS build 3 → re-run the history migration.

## Firestore rules and indexes

```bash
cd firebase
npm test                                                   # rules tests must pass
npx firebase-tools@latest deploy --only firestore --dry-run --project water-purifier-manager
npx firebase-tools@latest deploy --only firestore --project water-purifier-manager
npx firebase-tools@latest firestore:indexes --project water-purifier-manager   # verify
```

- Requires `npx firebase-tools login` as an owner of the project.
- **Use a current firebase-tools.** Version 13 (pinned in `firebase/package.json` for the emulator tests) misreads the index file and asks for `--force` to *delete* production indexes. Never pass `--force` unless you intend to delete indexes.
- Index builds take a few minutes; until then queries that need them fail (shared purifiers won't show).
- Rules can be rolled back by redeploying the previous version from git, or in Firebase console › Firestore › Rules (history).

## Web

Merging to `main` triggers a Vercel production deploy. Check the PR's preview deployment first. Vercel settings: Root Directory `web`, include files outside the root directory on ([Vercel](../05-specs/integrations/vercel.md)).

Rollback: promote a previous deployment in the Vercel dashboard, or revert the merge commit.

## iOS (TestFlight)

1. Bump `CURRENT_PROJECT_VERSION` of the **app target** (Debug and Release, bundle id `com.nguyenduyhust.waterpurifiermanager`) in `ios/WaterPurifierManager.xcodeproj/project.pbxproj`, or in Xcode › target › General › Build, and commit. The test targets' build numbers don't matter.
2. Archive with the personal team:

   ```bash
   cd ios
   xcodebuild -project WaterPurifierManager.xcodeproj -scheme WaterPurifierManager \
     -configuration Release -destination 'generic/platform=iOS' \
     -archivePath build/WaterPurifierManager.xcarchive \
     DEVELOPMENT_TEAM=HH22B576H5 -allowProvisioningUpdates archive
   ```

3. Upload with an `ExportOptions.plist` containing `method = app-store-connect`, `destination = upload`, `teamID = HH22B576H5`, `signingStyle = automatic`, `uploadSymbols = true`:

   ```bash
   xcodebuild -exportArchive -archivePath build/WaterPurifierManager.xcarchive \
     -exportOptionsPlist ExportOptions.plist -exportPath build/export -allowProvisioningUpdates
   ```

4. Wait for processing in App Store Connect (5–30 min); internal testers receive it automatically.

Requirements: Xcode signed in with the personal Apple ID (team `HH22B576H5`); `GoogleService-Info.plist` and `Config/Firebase.xcconfig` present locally. Never sign with the company team that is also in Xcode.

## Checklist after a release

- [ ] Web production loads and signs in.
- [ ] A shared purifier shows for a member (if sharing changed).
- [ ] `firestore:indexes` lists the expected indexes.
- [ ] Follow-up migration run, if planned.

## Related

- Environments → [environments.md](environments.md)
- Workflow → [`../04-development/workflow.md`](../04-development/workflow.md)
