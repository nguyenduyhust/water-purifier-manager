import SwiftUI

struct RootView: View {
    @Environment(AuthSession.self) private var session

    var body: some View {
        Group {
            switch session.state {
            case .loading:
                ProgressView()
            case .signedOut:
                NavigationStack {
                    SignInView()
                }
            case .signedIn(let user):
                MainTabView(user: user)
                    .id(user.uid)
            }
        }
        .task { session.start() }
    }
}

struct MainTabView: View {
    @State private var store: PurifierStore
    @State private var history: HistoryStore
    @State private var myInvites: MyInvitesStore
    @Environment(\.scenePhase) private var scenePhase

    init(user: AuthUser) {
        _store = State(initialValue: PurifierStore(user: user))
        _history = State(initialValue: HistoryStore(userId: user.uid))
        _myInvites = State(initialValue: MyInvitesStore(user: user))
    }

    var body: some View {
        @Bindable var store = store

        TabView {
            NavigationStack { DashboardView() }
                .tabItem { Label("Dashboard", systemImage: "gauge.with.dots.needle.33percent") }

            NavigationStack { PurifierListView() }
                .tabItem { Label("Purifiers", systemImage: "drop") }

            NavigationStack { HistoryView() }
                .tabItem { Label("History", systemImage: "clock.arrow.circlepath") }

            NavigationStack { SettingsView() }
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .environment(store)
        .environment(history)
        .environment(myInvites)
        .task {
            store.start()
            myInvites.start()
            if await NotificationScheduler.shared.requestAuthorizationIfNeeded() {
                store.scheduleNotifications()
            }
        }
        .onDisappear {
            store.stop()
            myInvites.stop()
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { store.refreshClock() }
        }
        .errorAlert($store.loadError)
    }
}

struct MissingConfigurationView: View {
    var body: some View {
        ContentUnavailableView {
            Label("Firebase is not configured", systemImage: "exclamationmark.triangle")
        } description: {
            Text("Add GoogleService-Info.plist to the app target. See ios/README.md.")
        }
    }
}
