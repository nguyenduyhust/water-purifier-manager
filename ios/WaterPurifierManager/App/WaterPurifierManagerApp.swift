import FirebaseCore
import GoogleSignIn
import SwiftUI
import UserNotifications

@main
struct WaterPurifierManagerApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    private let isFirebaseConfigured = FirebaseBootstrap.configure()
    @State private var session = AuthSession()

    var body: some Scene {
        WindowGroup {
            if isFirebaseConfigured {
                RootView()
                    .environment(session)
                    .onOpenURL { GIDSignIn.sharedInstance.handle($0) }
            } else {
                MissingConfigurationView()
            }
        }
    }
}

enum FirebaseBootstrap {
    /// Returns false when GoogleService-Info.plist isn't bundled; it is not
    /// committed to the repo (see ios/README.md).
    static func configure() -> Bool {
        if FirebaseApp.app() != nil { return true }
        guard Bundle.main.url(forResource: "GoogleService-Info", withExtension: "plist") != nil else { return false }
        FirebaseApp.configure()
        return true
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    // Show reminders even while the app is open.
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        [.banner, .list, .sound]
    }
}
