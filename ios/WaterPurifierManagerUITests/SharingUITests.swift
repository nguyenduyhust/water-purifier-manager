import XCTest

/// Drives the app against the local Firebase emulators. Before running:
///   cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier
///   node scripts/seed-sharing.mjs
final class SharingUITests: XCTestCase {
    private let timeout: TimeInterval = 15

    override func setUpWithError() throws {
        continueAfterFailure = false
        // These tests need the emulators and seed data; skip them in a plain `xcodebuild test`.
        let reachable = (try? Data(contentsOf: URL(string: "http://127.0.0.1:8080/")!)) != nil
        try XCTSkipUnless(reachable, "Firestore emulator not running on 127.0.0.1:8080")
    }

    func testEditorReplacesFilterAndHistoryShowsWhoDidIt() {
        let app = launchSignedIn(as: "bob@example.com")

        app.tabBars.buttons["Purifiers"].tap()
        XCTAssertTrue(text(in: app, containing: "Shared · Editor").waitForExistence(timeout: timeout))

        app.staticTexts["Kitchen purifier"].firstMatch.tap()
        XCTAssertTrue(app.staticTexts["Your role"].waitForExistence(timeout: timeout))
        XCTAssertTrue(app.staticTexts["Shared by"].exists)

        let replaceButtons = app.buttons.matching(identifier: "Replace")
        XCTAssertTrue(replaceButtons.firstMatch.waitForExistence(timeout: timeout))
        replaceButtons.firstMatch.tap()
        let confirm = app.navigationBars["Replace filter"].buttons["Replace"]
        XCTAssertTrue(confirm.waitForExistence(timeout: timeout))
        confirm.tap()
        XCTAssertTrue(confirm.waitForNonExistence(timeout: timeout))

        app.tabBars.buttons["History"].tap()
        XCTAssertTrue(text(in: app, containing: "by Bob").waitForExistence(timeout: timeout))
    }

    func testJoinWithInviteLink() {
        let app = launchSignedIn(as: "dave@example.com")

        app.tabBars.buttons["Purifiers"].tap()
        app.navigationBars.buttons["Add purifier"].tap()
        app.buttons["Join with invite link"].tap()

        let field = app.descendants(matching: .any)["inviteLinkField"].firstMatch
        XCTAssertTrue(field.waitForExistence(timeout: timeout))
        field.tap()
        field.typeText("https://water-purifier-manager.vercel.app/invite/daveInviteLink000001")

        let accept = app.buttons["Accept invite"]
        XCTAssertTrue(accept.waitForExistence(timeout: timeout))
        accept.tap()

        XCTAssertTrue(text(in: app, containing: "Shared · Viewer").waitForExistence(timeout: timeout))
    }

    func testViewerCannotReplaceFilters() {
        let app = launchSignedIn(as: "carol@example.com")

        app.tabBars.buttons["Purifiers"].tap()
        XCTAssertTrue(text(in: app, containing: "Shared · Viewer").waitForExistence(timeout: timeout))
        app.staticTexts["Kitchen purifier"].firstMatch.tap()

        XCTAssertTrue(text(in: app, containing: "view-only access").waitForExistence(timeout: timeout))
        XCTAssertFalse(app.buttons.matching(identifier: "Replace").firstMatch.exists)
    }

    // MARK: Helpers

    private func launchSignedIn(as email: String) -> XCUIApplication {
        let app = XCUIApplication()
        app.launchArguments = ["-useFirebaseEmulators", "-signOutOnLaunch", "-AppleLanguages", "(en)", "-AppleLocale", "en_US"]
        app.launch()

        let emailField = app.textFields["Email"]
        XCTAssertTrue(emailField.waitForExistence(timeout: timeout))
        emailField.tap()
        emailField.typeText(email)
        let password = app.secureTextFields["Password"]
        password.tap()
        password.typeText("secret123")
        let signIn = app.buttons.matching(NSPredicate(format: "label == 'Sign in' AND enabled == true")).firstMatch
        XCTAssertTrue(signIn.waitForExistence(timeout: timeout))
        signIn.tap()

        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: timeout))
        // iOS may offer to save the password and ask for notification permission;
        // both system prompts swallow taps until dismissed.
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        for _ in 0..<3 {
            if app.buttons["Not Now"].waitForExistence(timeout: 2) {
                app.buttons["Not Now"].tap()
            } else if springboard.buttons["Not Now"].exists {
                springboard.buttons["Not Now"].tap()
            } else if springboard.alerts.buttons["Allow"].exists {
                springboard.alerts.buttons["Allow"].tap()
            } else {
                break
            }
        }
        return app
    }

    private func text(in app: XCUIApplication, containing substring: String) -> XCUIElement {
        app.staticTexts.containing(NSPredicate(format: "label CONTAINS %@", substring)).firstMatch
    }
}
