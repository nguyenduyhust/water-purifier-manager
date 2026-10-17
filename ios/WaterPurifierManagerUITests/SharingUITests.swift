import XCTest

/// Drives the app against the local Firebase emulators. Before running:
///   cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier
///   node scripts/seed-sharing.mjs
final class SharingUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
        try skipUnlessEmulatorsRunning()
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
}
