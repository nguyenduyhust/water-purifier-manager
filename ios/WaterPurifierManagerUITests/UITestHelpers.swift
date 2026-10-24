import XCTest

/// Shared by the UI tests that run against the local Firebase emulators.
extension XCTestCase {
    var timeout: TimeInterval { 15 }

    /// Skips the test unless the Firestore emulator is running (a plain `xcodebuild test` has none).
    func skipUnlessEmulatorsRunning() throws {
        let reachable = (try? Data(contentsOf: URL(string: "http://127.0.0.1:8080/")!)) != nil
        try XCTSkipUnless(reachable, "Firestore emulator not running on 127.0.0.1:8080")
    }

    /// Launches the app signed out, on the sign in screen, in English.
    func launchSignedOut() -> XCUIApplication {
        let app = XCUIApplication()
        app.launchArguments = ["-useFirebaseEmulators", "-signOutOnLaunch", "-AppleLanguages", "(en)", "-AppleLocale", "en_US"]
        app.launch()
        XCTAssertTrue(app.textFields["Email"].waitForExistence(timeout: timeout))
        return app
    }

    func launchSignedIn(as email: String, password secret: String = "secret123") -> XCUIApplication {
        let app = launchSignedOut()
        let emailField = app.textFields["Email"]
        emailField.tap()
        emailField.typeText(email)
        let password = app.secureTextFields["Password"]
        password.tap()
        password.typeText(secret)
        let signIn = app.buttons.matching(NSPredicate(format: "label == 'Sign in' AND enabled == true")).firstMatch
        XCTAssertTrue(signIn.waitForExistence(timeout: timeout))
        signIn.tap()

        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: timeout))
        dismissSystemPrompts(in: app)
        return app
    }

    /// iOS may offer to save the password and ask for notification permission after sign-in;
    /// both prompts swallow taps until dismissed.
    func dismissSystemPrompts(in app: XCUIApplication) {
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
    }

    func text(in app: XCUIApplication, containing substring: String) -> XCUIElement {
        app.staticTexts.containing(NSPredicate(format: "label CONTAINS %@", substring)).firstMatch
    }
}
