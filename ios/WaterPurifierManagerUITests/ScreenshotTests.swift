import XCTest

/// Captures App Store screenshots as test attachments. Skipped unless requested:
///   cd firebase && node scripts/seed-screenshots.mjs vi
///   TEST_RUNNER_SCREENSHOT_LANG=vi xcodebuild test … -only-testing:WaterPurifierManagerUITests/ScreenshotTests
/// then export the attachments from the .xcresult bundle.
final class ScreenshotTests: XCTestCase {
    private struct Strings {
        let locale: String
        let kitchen: String
        let share: String
    }

    private var language: String? { ProcessInfo.processInfo.environment["SCREENSHOT_LANG"] }

    override func setUpWithError() throws {
        continueAfterFailure = false
        try XCTSkipUnless(language != nil, "Set TEST_RUNNER_SCREENSHOT_LANG=en|vi to capture screenshots")
        try skipUnlessEmulatorsRunning()
    }

    func testCaptureScreenshots() {
        let strings = language == "vi"
            ? Strings(locale: "vi_VN", kitchen: "Bếp", share: "Chia sẻ (1)")
            : Strings(locale: "en_US", kitchen: "Kitchen", share: "Share (1)")

        // Sign in through the English UI, then relaunch in the target language; the session persists.
        launchSignedIn(as: "demo@example.com").terminate()
        let app = XCUIApplication()
        app.launchArguments = [
            "-useFirebaseEmulators",
            "-AppleLanguages", "(\(language ?? "en"))",
            "-AppleLocale", strings.locale,
        ]
        app.launch()

        let tabs = app.tabBars.buttons
        XCTAssertTrue(tabs.firstMatch.waitForExistence(timeout: timeout))
        sleep(3)
        capture(app, "1-dashboard")

        tabs.element(boundBy: 1).tap()
        sleep(2)
        capture(app, "2-purifiers")

        app.staticTexts[strings.kitchen].firstMatch.tap()
        sleep(2)
        capture(app, "3-purifier-detail")

        app.navigationBars.buttons.element(boundBy: app.navigationBars.buttons.count - 1).tap()
        let share = app.buttons[strings.share]
        XCTAssertTrue(share.waitForExistence(timeout: timeout))
        share.tap()
        sleep(2)
        capture(app, "5-share")
        app.swipeDown(velocity: .fast)
        sleep(1)

        tabs.element(boundBy: 2).tap()
        sleep(2)
        capture(app, "4-history")
    }

    private func capture(_ app: XCUIApplication, _ name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = "\(language ?? "en")-\(name)"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
