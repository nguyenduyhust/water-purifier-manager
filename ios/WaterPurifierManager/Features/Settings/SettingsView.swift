import SwiftUI
import UserNotifications

struct SettingsView: View {
    @Environment(AuthSession.self) private var session
    @Environment(PurifierStore.self) private var store
    @Environment(\.openURL) private var openURL
    @Environment(\.scenePhase) private var scenePhase

    @State private var notificationStatus: UNAuthorizationStatus = .notDetermined
    @State private var isConfirmingSignOut = false
    @State private var errorMessage: String?

    private var user: AuthUser? {
        if case .signedIn(let user) = session.state { return user }
        return nil
    }

    private var appVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "–"
    }

    var body: some View {
        List {
            Section("Account") {
                if let name = user?.displayName, !name.isEmpty {
                    LabeledContent("Name", value: name)
                }
                if let email = user?.email {
                    LabeledContent("Email", value: email)
                }
            }

            Section {
                notificationRow
            } header: {
                Text("Reminders")
            } footer: {
                Text("You'll be reminded \(NotificationScheduler.advanceNoticeDays) days before and on the day each filter is due, at \(NotificationScheduler.reminderHour):00.")
            }

            Section {
                Button("Change language") { openAppSettings() }
            } header: {
                Text("Language")
            } footer: {
                Text("The app follows your iPhone's language. You can choose a different language for this app in Settings.")
            }

            Section {
                Button("Sign out", role: .destructive) { isConfirmingSignOut = true }
            }

            Section {
                LabeledContent("Version", value: appVersion)
            }
        }
        .navigationTitle("Settings")
        .task(id: scenePhase) { await refreshNotificationStatus() }
        .confirmationDialog("Sign out?", isPresented: $isConfirmingSignOut, titleVisibility: .visible) {
            Button("Sign out", role: .destructive) { signOut() }
        }
        .errorAlert($errorMessage)
    }

    @ViewBuilder
    private var notificationRow: some View {
        switch notificationStatus {
        case .authorized, .provisional, .ephemeral:
            Label("Reminders are on", systemImage: "bell.badge.fill")
        case .denied:
            Button {
                openAppSettings()
            } label: {
                Label("Turn on reminders in Settings", systemImage: "bell.slash")
            }
        default:
            Button {
                Task {
                    if await NotificationScheduler.shared.requestAuthorizationIfNeeded() {
                        store.scheduleNotifications()
                    }
                    await refreshNotificationStatus()
                }
            } label: {
                Label("Turn on reminders", systemImage: "bell")
            }
        }
    }

    private func refreshNotificationStatus() async {
        notificationStatus = await NotificationScheduler.shared.authorizationStatus()
    }

    private func openAppSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            openURL(url)
        }
    }

    private func signOut() {
        do {
            try session.signOut()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
