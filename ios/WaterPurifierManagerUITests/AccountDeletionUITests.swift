import XCTest

/// Deletes an account from Settings against the local Firebase emulators. The test creates
/// its own user and data, so it does not disturb the shared seed data. Before running:
///   cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier
final class AccountDeletionUITests: XCTestCase {
    private let data = EmulatorData()

    override func setUpWithError() throws {
        continueAfterFailure = false
        try skipUnlessEmulatorsRunning()
    }

    @MainActor
    func testDeletingAccountRemovesOwnedDataAndMemberships() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "erin-\(suffix)@example.com"
        let uid = try await data.createUser(email: email, name: "Erin")
        let owned = "erin-\(suffix)"
        let shared = "shared-with-erin-\(suffix)"

        try await data.createPurifier(id: owned, owner: (uid, "Erin"), name: "Erin's purifier")
        try await data.write("purifiers/\(owned)/logs/created", [
            "type": data.string("purifier_created"),
            "actorId": data.string(uid),
            "timestamp": data.timestamp(.now),
        ])
        try await data.write("invites/invite-\(suffix)", [
            "purifierId": data.string(owned),
            "createdBy": data.string(uid),
            "status": data.string("pending"),
            "role": data.string("viewer"),
        ])
        try await data.write("activityLogs/legacy-\(suffix)", [
            "userId": data.string(uid),
            "purifierId": data.string(owned),
            "type": data.string("purifier_created"),
            "timestamp": data.timestamp(.now),
        ])
        try await data.createPurifier(
            id: shared, owner: ("someone-else", "Someone"), name: "Shared with Erin",
            members: [(uid, "Erin", "viewer")]
        )

        let app = launchSignedIn(as: email)
        app.tabBars.buttons["Settings"].tap()
        let delete = app.buttons["Delete account"]
        XCTAssertTrue(delete.waitForExistence(timeout: timeout))
        delete.tap()

        // Email accounts confirm and enter their password in one alert.
        let passwordField = app.alerts.secureTextFields["Password"]
        XCTAssertTrue(passwordField.waitForExistence(timeout: timeout))
        passwordField.tap()
        passwordField.typeText(EmulatorData.password)
        app.alerts.buttons["Delete account"].tap()

        XCTAssertTrue(app.textFields["Email"].waitForExistence(timeout: 30), "Expected to return to sign in")

        for path in [
            "purifiers/\(owned)",
            "purifiers/\(owned)/filters/\(owned)-f1",
            "purifiers/\(owned)/logs/created",
            "invites/invite-\(suffix)",
            "activityLogs/legacy-\(suffix)",
        ] {
            let stillThere = try await data.exists(path)
            XCTAssertFalse(stillThere, "\(path) was not deleted")
        }
        let sharedDoc = try await data.read("purifiers/\(shared)")
        XCTAssertFalse(String(data: sharedDoc ?? Data(), encoding: .utf8)?.contains(uid) ?? true, "Still a member")
        let accountStillThere = try await data.accountExists(uid)
        XCTAssertFalse(accountStillThere, "Auth account was not deleted")
    }
}
