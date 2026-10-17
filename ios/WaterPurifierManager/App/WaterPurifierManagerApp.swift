import FirebaseAuth
import FirebaseCore
import FirebaseFirestore
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
        guard
            let url = Bundle.main.url(forResource: "GoogleService-Info", withExtension: "plist"),
            let options = FirebaseOptions(contentsOfFile: url.path)
        else { return false }

        #if DEBUG
        if usesEmulators {
            // Same demo project as `npm run dev:emulator`, so the emulator's rules apply.
            options.projectID = "demo-water-purifier"
        }
        #endif

        FirebaseApp.configure(options: options)

        #if DEBUG
        if usesEmulators {
            Auth.auth().useEmulator(withHost: "127.0.0.1", port: 9099)
            let settings = Firestore.firestore().settings
            settings.host = "127.0.0.1:8080"
            settings.isSSLEnabled = false
            settings.cacheSettings = MemoryCacheSettings()
            Firestore.firestore().settings = settings
            // UI tests start each run from the sign-in screen.
            if ProcessInfo.processInfo.arguments.contains("-signOutOnLaunch") {
                try? Auth.auth().signOut()
            }
        }
        #endif
        return true
    }

    #if DEBUG
    /// Launch with `-useFirebaseEmulators` (UI tests do) to use the local emulators in firebase/.
    private static var usesEmulators: Bool {
        ProcessInfo.processInfo.arguments.contains("-useFirebaseEmulators")
    }
    #endif
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
