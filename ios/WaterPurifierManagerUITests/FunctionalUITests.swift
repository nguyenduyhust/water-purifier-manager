import XCTest

/// The main user journeys from docs/06-testing/test-cases.md, against the local emulators.
/// Each test creates its own users and data, so the tests run in any order and don't need the seed.
///   cd firebase && npx firebase emulators:start --only auth,firestore --project demo-water-purifier
final class FunctionalUITests: XCTestCase {
    private let data = EmulatorData()

    override func setUpWithError() throws {
        continueAfterFailure = false
        try skipUnlessEmulatorsRunning()
    }

    /// Attaches what was on screen when an assertion fails, to see why in the result bundle.
    override func record(_ issue: XCTIssue) {
        var issue = issue
        let app = XCUIApplication()
        if app.state == .runningForeground {
            issue.add(XCTAttachment(screenshot: app.screenshot()))
            issue.add(XCTAttachment(string: app.debugDescription))
        }
        super.record(issue)
    }

    // MARK: Authentication

    /// TC-AUTH-01, TC-PUR-01, TC-HIS-04
    func testSignUpShowsEmptyDashboard() {
        let app = launchSignedOut()
        app.buttons["Don't have an account? Sign up"].tap()

        type("Nora", into: app.textFields["Name"])
        type("nora-\(EmulatorData.uniqueSuffix())@example.com", into: app.textFields["Email"])
        type(EmulatorData.password, into: app.secureTextFields["Password"])
        type(EmulatorData.password, into: app.secureTextFields["Confirm password"])
        app.buttons["Create account"].tap()

        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: timeout))
        dismissSystemPrompts(in: app)
        XCTAssertTrue(app.staticTexts["No purifiers yet"].waitForExistence(timeout: timeout))

        app.tabBars.buttons["Purifiers"].tap()
        XCTAssertTrue(app.staticTexts["No purifiers yet"].waitForExistence(timeout: timeout))
        app.tabBars.buttons["History"].tap()
        XCTAssertTrue(app.staticTexts["No history yet"].waitForExistence(timeout: timeout))
    }

    /// TC-AUTH-02
    func testSignUpRejectsMismatchedPasswords() {
        let app = launchSignedOut()
        app.buttons["Don't have an account? Sign up"].tap()

        type("Nora", into: app.textFields["Name"])
        type("nora@example.com", into: app.textFields["Email"])
        type("secret123", into: app.secureTextFields["Password"])
        type("secret124", into: app.secureTextFields["Confirm password"])

        XCTAssertTrue(app.staticTexts["Passwords don't match"].waitForExistence(timeout: timeout))
        XCTAssertFalse(app.buttons["Create account"].isEnabled)
    }

    /// TC-AUTH-05, TC-AUTH-06
    func testSignInWithWrongPasswordShowsError() async throws {
        let email = "omar-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Omar")

        await MainActor.run {
            let app = launchSignedOut()
            XCTAssertFalse(app.buttons["Sign in"].isEnabled, "Sign in must be disabled with empty fields")

            type(email, into: app.textFields["Email"])
            type("wrongpass", into: app.secureTextFields["Password"])
            app.buttons["Sign in"].tap()

            XCTAssertTrue(app.alerts.staticTexts["Invalid email or password"].waitForExistence(timeout: timeout))
            app.alerts.buttons["OK"].tap()
            XCTAssertFalse(app.tabBars.firstMatch.exists)
        }
    }

    /// TC-AUTH-07
    func testForgotPasswordSendsResetLink() async throws {
        let email = "pia-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Pia")

        await MainActor.run {
            let app = launchSignedOut()
            app.buttons["Forgot password?"].tap()
            let field = app.textFields["Email"]
            XCTAssertTrue(field.waitForExistence(timeout: timeout))
            type(email, into: field)
            app.buttons["Send reset link"].tap()

            XCTAssertTrue(app.staticTexts["Check your email"].waitForExistence(timeout: timeout))
            XCTAssertTrue(text(in: app, containing: email).exists)
            app.buttons["Back to sign in"].tap()
            XCTAssertTrue(app.buttons["Sign in"].waitForExistence(timeout: timeout))
        }
    }

    /// TC-AUTH-11
    func testSignOutReturnsToSignIn() async throws {
        let email = "quinn-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Quinn")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Settings"].tap()
            app.buttons["Sign out"].firstMatch.tap()
            // The confirmation dialog repeats the button below the list's one.
            XCTAssertTrue(app.buttons["Cancel"].waitForExistence(timeout: timeout))
            app.buttons.matching(identifier: "Sign out").allElementsBoundByIndex
                .max { $0.frame.minY < $1.frame.minY }?.tap()
            XCTAssertTrue(app.textFields["Email"].waitForExistence(timeout: timeout))
        }
    }

    // MARK: Purifiers

    /// TC-PUR-02, TC-PUR-03, TC-PUR-04, TC-PUR-05, TC-PUR-07, TC-PUR-08
    func testCreateEditAndDeletePurifier() async throws {
        let email = "rosa-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Rosa")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Purifiers"].tap()
            // The empty state's button; the toolbar's "Add purifier" opens a menu.
            XCTAssertTrue(app.staticTexts["No purifiers yet"].waitForExistence(timeout: timeout))
            let add = app.buttons.matching(identifier: "Add purifier").allElementsBoundByIndex
                .first { $0.frame.minY > app.navigationBars.firstMatch.frame.maxY }
            XCTAssertNotNil(add)
            add?.tap()

            let save = app.navigationBars["New purifier"].buttons["Save"]
            XCTAssertTrue(save.waitForExistence(timeout: timeout))
            XCTAssertFalse(save.isEnabled, "Save needs a name and a model")

            // Text fields with a prompt are found by their placeholder.
            type("Test purifier", into: app.textFields["e.g. Kitchen purifier"])
            type("Office", into: app.textFields["e.g. Kitchen, Living room"])
            XCTAssertFalse(save.isEnabled, "Save still needs a model")

            app.buttons["Purifier type"].tap()
            // Models are grouped under brand headers (order is covered by PurifierTypeCatalogTests).
            XCTAssertTrue(label(in: app, equalTo: "Kangaroo").waitForExistence(timeout: timeout), "Missing brand header")
            app.buttons["Kangaroo - KG102 (5 filters)"].tap()

            XCTAssertTrue(text(in: app, containing: "Filter 5 -").waitForExistence(timeout: timeout))
            XCTAssertTrue(save.isEnabled)
            save.tap()

            let row = app.staticTexts["Test purifier"]
            XCTAssertTrue(row.waitForExistence(timeout: timeout))
            row.tap()
            XCTAssertTrue(app.navigationBars["Test purifier"].waitForExistence(timeout: timeout))
            XCTAssertTrue(text(in: app, containing: "Kangaroo - KG102 (5 filters)").exists)
            XCTAssertTrue(text(in: app, containing: "Filter 1 -").waitForExistence(timeout: timeout), "Filters of a new purifier")
            app.swipeUp()
            XCTAssertTrue(text(in: app, containing: "Filter 5 -").waitForExistence(timeout: timeout), "All 5 filters created")
            app.swipeDown()

            app.navigationBars.buttons["More"].tap()
            app.buttons["Edit"].tap()
            let name = app.textFields["e.g. Kitchen purifier"]
            XCTAssertTrue(name.waitForExistence(timeout: timeout))
            name.tap()
            name.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: 20) + "Renamed purifier")
            app.navigationBars["Edit purifier"].buttons["Save"].tap()
            XCTAssertTrue(app.navigationBars["Renamed purifier"].waitForExistence(timeout: timeout))

            app.navigationBars.buttons["More"].tap()
            app.buttons["Delete purifier"].tap()
            let confirm = app.buttons["Delete"]
            XCTAssertTrue(confirm.waitForExistence(timeout: timeout))
            confirm.tap()
            XCTAssertTrue(app.staticTexts["No purifiers yet"].waitForExistence(timeout: timeout))
        }
    }

    // MARK: Filters, dashboard, history

    /// TC-FIL-02, TC-FIL-03, TC-HIS-01
    func testReplaceFilterUpdatesStatusAndHistory() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "sam-\(suffix)@example.com"
        let uid = try await data.createUser(email: email, name: "Sam")
        // Filter 1: 3-month interval, replaced 80 days ago → due soon. Filter 2 is OK.
        try await data.createPurifier(id: "sam-\(suffix)", owner: (uid, "Sam"), name: "Sam's purifier")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Purifiers"].tap()
            app.staticTexts["Sam's purifier"].tap()

            XCTAssertTrue(app.staticTexts["Due soon"].waitForExistence(timeout: timeout))
            XCTAssertTrue(app.staticTexts["Last replaced"].exists)
            XCTAssertTrue(app.staticTexts["Next replacement"].exists)

            // Most urgent first, so the first Replace belongs to the due-soon filter.
            app.buttons.matching(identifier: "Replace").firstMatch.tap()
            let notes = app.descendants(matching: .any)
                .matching(NSPredicate(format: "placeholderValue BEGINSWITH 'e.g. Replaced'")).firstMatch
            XCTAssertTrue(notes.waitForExistence(timeout: timeout))
            type("Genuine filter", into: notes)
            app.navigationBars["Replace filter"].buttons["Replace"].tap()

            XCTAssertTrue(app.staticTexts["Due soon"].waitForNonExistence(timeout: timeout))
            XCTAssertEqual(app.staticTexts.matching(identifier: "OK").count, 2)

            app.tabBars.buttons["History"].tap()
            XCTAssertTrue(app.staticTexts["Filter replaced"].waitForExistence(timeout: timeout))
            XCTAssertTrue(text(in: app, containing: "by Sam").exists)
        }
    }

    /// TC-DSH-01, TC-DSH-02
    func testDashboardShowsStatistics() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "tess-\(suffix)@example.com"
        let uid = try await data.createUser(email: email, name: "Tess")
        try await data.createPurifier(id: "tess-\(suffix)", owner: (uid, "Tess"), name: "Tess's purifier")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            XCTAssertTrue(label(in: app, equalTo: "Filters needing attention").waitForExistence(timeout: timeout))
            // Each tile is a number followed by its title.
            let labels = app.staticTexts.allElementsBoundByIndex.map(\.label)
            for (value, title) in [("1", "Purifiers"), ("2", "Filters"), ("1", "Needs attention"), ("1", "Filters OK")] {
                let shown = zip(labels, labels.dropFirst()).contains { $0 == (value, title) }
                XCTAssertTrue(shown, "Tile \(title) should show \(value)")
            }

            let row = text(in: app, containing: "Filter 1 - PP 5µm")
            XCTAssertTrue(row.exists)
            row.tap()
            XCTAssertTrue(app.navigationBars["Tess's purifier"].waitForExistence(timeout: timeout))
        }
    }

    // MARK: Settings and language

    /// TC-SET-01, TC-SET-02, TC-REM-02
    func testSettingsShowsAccountAndLinks() async throws {
        let email = "uma-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Uma")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Settings"].tap()
            XCTAssertTrue(text(in: app, containing: "Uma").waitForExistence(timeout: timeout))
            XCTAssertTrue(text(in: app, containing: email).exists)
            XCTAssertTrue(app.staticTexts["Reminders are on"].exists)
            XCTAssertTrue(app.buttons["Privacy Policy"].exists)
            XCTAssertTrue(app.buttons["Support"].exists)
            app.swipeUp()
            XCTAssertTrue(text(in: app, containing: "1.0").exists, "Version 1.0")
        }
    }

    /// TC-I18N-01
    func testVietnameseInterface() async throws {
        let email = "vy-\(EmulatorData.uniqueSuffix())@example.com"
        _ = try await data.createUser(email: email, name: "Vy")

        await MainActor.run {
            // Sign in through the English UI, then relaunch in Vietnamese; the session persists.
            launchSignedIn(as: email).terminate()
            let app = XCUIApplication()
            app.launchArguments = ["-useFirebaseEmulators", "-AppleLanguages", "(vi)", "-AppleLocale", "vi_VN"]
            app.launch()

            let tabs = app.tabBars.firstMatch
            XCTAssertTrue(tabs.waitForExistence(timeout: timeout))
            for title in ["Tổng quan", "Máy lọc", "Lịch sử", "Cài đặt"] {
                XCTAssertTrue(tabs.buttons[title].exists, "Missing tab \(title)")
            }
            tabs.buttons["Cài đặt"].tap()
            XCTAssertTrue(app.buttons["Xóa tài khoản"].waitForExistence(timeout: timeout))
        }
    }

    // MARK: Sharing

    /// TC-SHR-01, TC-SHR-03
    func testOwnerCreatesAndRevokesInvite() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "will-\(suffix)@example.com"
        let uid = try await data.createUser(email: email, name: "Will")
        try await data.createPurifier(id: "will-\(suffix)", owner: (uid, "Will"), name: "Will's purifier")

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Purifiers"].tap()
            app.staticTexts["Will's purifier"].tap()
            app.navigationBars.buttons["More"].tap()
            app.buttons["Share"].tap()

            let create = app.buttons["Create invite link"]
            XCTAssertTrue(create.waitForExistence(timeout: timeout))
            create.tap()
            XCTAssertTrue(app.buttons["Copy link"].waitForExistence(timeout: timeout))
            let pending = app.staticTexts["Anyone with the link"]
            XCTAssertTrue(pending.waitForExistence(timeout: timeout))

            pending.swipeLeft()
            app.buttons["Revoke"].tap()
            XCTAssertTrue(pending.waitForNonExistence(timeout: timeout))
        }
    }

    /// TC-SHR-08, TC-SHR-09
    func testOwnerChangesRoleAndRemovesMember() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "xena-\(suffix)@example.com"
        let owner = try await data.createUser(email: email, name: "Xena")
        let member = try await data.createUser(email: "yuri-\(suffix)@example.com", name: "Yuri")
        let id = "xena-\(suffix)"
        try await data.createPurifier(id: id, owner: (owner, "Xena"), name: "Xena's purifier", members: [(member, "Yuri", "editor")])

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Purifiers"].tap()
            app.staticTexts["Xena's purifier"].tap()
            app.navigationBars.buttons["More"].tap()
            app.buttons["Share (1)"].tap()

            let memberRow = app.buttons.containing(NSPredicate(format: "label CONTAINS 'Yuri'")).firstMatch
            XCTAssertTrue(memberRow.waitForExistence(timeout: timeout))
            memberRow.tap()
            app.buttons["Viewer"].firstMatch.tap()
        }
        try await waitForDocument("purifiers/\(id)") { $0.contains("\"viewer\"") && !$0.contains("\"editor\"") }

        await MainActor.run {
            let app = XCUIApplication()
            let memberRow = app.buttons.containing(NSPredicate(format: "label CONTAINS 'Yuri'")).firstMatch
            memberRow.swipeLeft()
            app.buttons["Remove"].tap()
            let confirm = app.buttons.matching(identifier: "Remove").element(boundBy: 0)
            XCTAssertTrue(confirm.waitForExistence(timeout: timeout))
            confirm.tap()
            XCTAssertTrue(memberRow.waitForNonExistence(timeout: timeout))
        }
        try await waitForDocument("purifiers/\(id)") { !$0.contains(member) }
    }

    /// TC-SHR-10
    func testMemberLeavesSharedPurifier() async throws {
        let suffix = EmulatorData.uniqueSuffix()
        let email = "zoe-\(suffix)@example.com"
        let member = try await data.createUser(email: email, name: "Zoe")
        let owner = try await data.createUser(email: "abe-\(suffix)@example.com", name: "Abe")
        let id = "abe-\(suffix)"
        try await data.createPurifier(id: id, owner: (owner, "Abe"), name: "Abe's purifier", members: [(member, "Zoe", "viewer")])

        await MainActor.run {
            let app = launchSignedIn(as: email)
            app.tabBars.buttons["Purifiers"].tap()
            XCTAssertTrue(text(in: app, containing: "Shared · Viewer").waitForExistence(timeout: timeout))
            app.staticTexts["Abe's purifier"].tap()
            XCTAssertTrue(text(in: app, containing: "Abe").waitForExistence(timeout: timeout))

            app.navigationBars.buttons["More"].tap()
            app.buttons["Leave"].tap()
            let confirm = app.buttons.matching(identifier: "Leave").firstMatch
            XCTAssertTrue(confirm.waitForExistence(timeout: timeout))
            confirm.tap()
            XCTAssertTrue(app.staticTexts["No purifiers yet"].waitForExistence(timeout: timeout))
        }
        try await waitForDocument("purifiers/\(id)") { !$0.contains(member) }
    }

    // MARK: Helpers

    /// Matches a label regardless of case and element type: section headers are shown in upper
    /// case, and in a navigation-link picker they are exposed as buttons.
    private func label(in app: XCUIApplication, equalTo text: String) -> XCUIElement {
        app.descendants(matching: .any).matching(NSPredicate(format: "label ==[c] %@", text)).firstMatch
    }

    private func type(_ text: String, into element: XCUIElement) {
        XCTAssertTrue(element.waitForExistence(timeout: timeout), "\(element) not found")
        element.tap()
        // A multi-line field doesn't always become first responder from an element tap.
        let app = XCUIApplication()
        if !app.keyboards.firstMatch.waitForExistence(timeout: 2) {
            element.coordinate(withNormalizedOffset: CGVector(dx: 0.1, dy: 0.5)).tap()
            _ = app.keyboards.firstMatch.waitForExistence(timeout: 2)
        }
        app.typeText(text)
    }

    /// Polls a Firestore document until `condition` holds for its JSON.
    private func waitForDocument(_ path: String, _ condition: (String) -> Bool) async throws {
        for _ in 0..<20 {
            if let json = try await data.read(path).flatMap({ String(data: $0, encoding: .utf8) }), condition(json) { return }
            try await Task.sleep(for: .milliseconds(500))
        }
        XCTFail("\(path) never matched")
    }
}
