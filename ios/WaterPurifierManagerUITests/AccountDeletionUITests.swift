import XCTest

/// Deletes an account from Settings against the local Firebase emulators. The test creates
/// its own user and data, so it does not disturb the shared seed data. Before running:
///   cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier
final class AccountDeletionUITests: XCTestCase {
    private let project = "demo-water-purifier"
    private var firestore: String { "http://127.0.0.1:8080/v1/projects/\(project)/databases/(default)/documents" }
    private var identity: String { "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1" }

    override func setUpWithError() throws {
        continueAfterFailure = false
        try skipUnlessEmulatorsRunning()
    }

    @MainActor
    func testDeletingAccountRemovesOwnedDataAndMemberships() async throws {
        let suffix = UUID().uuidString.prefix(8).lowercased()
        let email = "erin-\(suffix)@example.com"
        let uid = try await createUser(email: email)
        let owned = "erin-\(suffix)"
        let shared = "shared-with-erin-\(suffix)"
        let now = ISO8601DateFormatter().string(from: .now)

        try await write("purifiers/\(owned)", [
            "userId": ["stringValue": uid],
            "name": ["stringValue": "Erin's purifier"],
            "typeId": ["stringValue": "kangaroo-kg102"],
            "createdAt": ["timestampValue": now],
            "installationDate": ["timestampValue": now],
            "memberIds": ["arrayValue": [String: String]()],
        ])
        try await write("purifiers/\(owned)/filters/f1", [
            "userId": ["stringValue": uid],
            "purifierId": ["stringValue": owned],
            "position": ["integerValue": "1"],
            "name": ["stringValue": "Filter 1 - PP 5µm"],
            "intervalMonths": ["integerValue": "3"],
            "lastReplacedAt": ["timestampValue": now],
        ])
        try await write("purifiers/\(owned)/logs/created", [
            "type": ["stringValue": "purifier_created"],
            "actorId": ["stringValue": uid],
            "timestamp": ["timestampValue": now],
        ])
        try await write("invites/invite-\(suffix)", [
            "purifierId": ["stringValue": owned],
            "createdBy": ["stringValue": uid],
            "status": ["stringValue": "pending"],
            "role": ["stringValue": "viewer"],
        ])
        try await write("activityLogs/legacy-\(suffix)", [
            "userId": ["stringValue": uid],
            "purifierId": ["stringValue": owned],
            "type": ["stringValue": "purifier_created"],
            "timestamp": ["timestampValue": now],
        ])
        try await write("purifiers/\(shared)", [
            "userId": ["stringValue": "someone-else"],
            "name": ["stringValue": "Shared with Erin"],
            "typeId": ["stringValue": "kangaroo-kg102"],
            "createdAt": ["timestampValue": now],
            "memberIds": ["arrayValue": ["values": [["stringValue": uid]]]],
            "roles": ["mapValue": ["fields": [uid: ["stringValue": "viewer"]]]],
            "memberProfiles": ["mapValue": ["fields": [uid: ["mapValue": ["fields": ["name": ["stringValue": "Erin"]]]]]]],
        ])

        let app = launchSignedIn(as: email)
        app.tabBars.buttons["Settings"].tap()
        let delete = app.buttons["Delete account"]
        XCTAssertTrue(delete.waitForExistence(timeout: timeout))
        delete.tap()

        // Email accounts confirm and enter their password in one alert.
        let passwordField = app.alerts.secureTextFields["Password"]
        XCTAssertTrue(passwordField.waitForExistence(timeout: timeout))
        passwordField.tap()
        passwordField.typeText("secret123")
        app.alerts.buttons["Delete account"].tap()

        XCTAssertTrue(app.textFields["Email"].waitForExistence(timeout: 30), "Expected to return to sign in")

        for path in [
            "purifiers/\(owned)",
            "purifiers/\(owned)/filters/f1",
            "purifiers/\(owned)/logs/created",
            "invites/invite-\(suffix)",
            "activityLogs/legacy-\(suffix)",
        ] {
            let stillThere = try await exists(path)
            XCTAssertFalse(stillThere, "\(path) was not deleted")
        }
        let sharedDoc = try await read("purifiers/\(shared)")
        XCTAssertFalse(String(data: sharedDoc ?? Data(), encoding: .utf8)?.contains(uid) ?? true, "Still a member")
        let accountStillThere = try await accountExists(uid)
        XCTAssertFalse(accountStillThere, "Auth account was not deleted")
    }

    // MARK: Emulator REST helpers (`owner` bypasses security rules)

    private func request(_ url: String, method: String = "GET", body: Any? = nil, authorized: Bool = true) throws -> URLRequest {
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if authorized { request.setValue("Bearer owner", forHTTPHeaderField: "Authorization") }
        if let body { request.httpBody = try JSONSerialization.data(withJSONObject: body) }
        return request
    }

    private func createUser(email: String) async throws -> String {
        let (data, _) = try await URLSession.shared.data(for: request(
            "\(identity)/accounts:signUp?key=demo-api-key",
            method: "POST",
            body: ["email": email, "password": "secret123", "displayName": "Erin"],
            authorized: false
        ))
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: data) as? [String: Any])
        return try XCTUnwrap(json["localId"] as? String)
    }

    private func write(_ path: String, _ fields: [String: Any]) async throws {
        let (_, response) = try await URLSession.shared.data(for: request(
            "\(firestore)/\(path)", method: "PATCH", body: ["fields": fields]
        ))
        XCTAssertEqual((response as? HTTPURLResponse)?.statusCode, 200, "write \(path)")
    }

    private func read(_ path: String) async throws -> Data? {
        let (data, response) = try await URLSession.shared.data(for: request("\(firestore)/\(path)"))
        return (response as? HTTPURLResponse)?.statusCode == 200 ? data : nil
    }

    private func exists(_ path: String) async throws -> Bool {
        try await read(path) != nil
    }

    private func accountExists(_ uid: String) async throws -> Bool {
        let (data, _) = try await URLSession.shared.data(for: request(
            "\(identity)/projects/\(project)/accounts:lookup", method: "POST", body: ["localId": [uid]]
        ))
        let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        return (json?["users"] as? [Any])?.isEmpty == false
    }
}
