import FirebaseFirestore
import Foundation
import Observation

struct DashboardStats {
    var totalPurifiers = 0
    var totalFilters = 0
    var expiredFilters = 0
    var warningFilters = 0
    var okFilters = 0
}

/// Live purifiers and filters for the signed-in user, shared by every tab.
@MainActor
@Observable
final class PurifierStore {
    private(set) var purifiers: [Purifier] = []
    private(set) var filtersByPurifier: [String: [Filter]] = [:]
    private(set) var isLoading = true
    var loadError: String?

    /// Statuses are relative to this; refreshed when the app returns to the foreground.
    private(set) var now = Date.now

    let userId: String

    @ObservationIgnored private let repository = PurifierRepository()
    @ObservationIgnored private let notifications: NotificationScheduler
    @ObservationIgnored private var purifiersListener: ListenerRegistration?
    @ObservationIgnored private var filterListeners: [String: ListenerRegistration] = [:]
    @ObservationIgnored private var rescheduleTask: Task<Void, Never>?

    init(userId: String, notifications: NotificationScheduler = .shared) {
        self.userId = userId
        self.notifications = notifications
    }

    // MARK: Lifecycle

    func start() {
        guard purifiersListener == nil else { return }
        purifiersListener = repository.listenToPurifiers(userId: userId) { [weak self] result in
            MainActor.assumeIsolated { self?.handlePurifiers(result) }
        }
    }

    func stop() {
        purifiersListener?.remove()
        purifiersListener = nil
        filterListeners.values.forEach { $0.remove() }
        filterListeners = [:]
        rescheduleTask?.cancel()
    }

    func refreshClock() {
        now = .now
        scheduleNotifications()
    }

    // MARK: Queries

    func purifier(id: String) -> Purifier? {
        purifiers.first { $0.id == id }
    }

    func filterItems(for purifierId: String) -> [FilterItem] {
        guard let purifier = purifier(id: purifierId) else { return [] }
        return FilterStatusCalculator.sortedByUrgency(items(for: purifier), schedule: \.schedule)
    }

    var allFilterItems: [FilterItem] {
        FilterStatusCalculator.sortedByUrgency(purifiers.flatMap(items(for:)), schedule: \.schedule)
    }

    var stats: DashboardStats {
        let items = allFilterItems
        return DashboardStats(
            totalPurifiers: purifiers.count,
            totalFilters: items.count,
            expiredFilters: items.filter { $0.schedule.status == .expired }.count,
            warningFilters: items.filter { $0.schedule.status == .warning }.count,
            okFilters: items.filter { $0.schedule.status == .ok }.count
        )
    }

    // MARK: Actions

    func create(_ newPurifier: NewPurifier) async throws {
        try await repository.create(newPurifier, userId: userId)
    }

    func update(purifierId: String, name: String, location: String, notes: String) async throws {
        try await repository.update(purifierId: purifierId, name: name, location: location, notes: notes)
    }

    func delete(purifierId: String) async throws {
        try await repository.delete(purifierId: purifierId, userId: userId)
    }

    func replaceFilter(_ item: FilterItem, replacedAt: Date, notes: String) async throws {
        try await repository.replaceFilter(item, replacedAt: replacedAt, notes: notes)
    }

    func scheduleNotifications() {
        let reminders = allFilterItems.compactMap { item -> FilterReminder? in
            guard let filterId = item.filter.id else { return nil }
            return FilterReminder(
                filterId: filterId,
                filterName: item.filter.name,
                purifierName: item.purifier.name,
                dueDate: item.schedule.nextReplacementAt
            )
        }

        // Snapshots arrive one purifier at a time; wait for them to settle.
        rescheduleTask?.cancel()
        rescheduleTask = Task { [notifications] in
            try? await Task.sleep(for: .milliseconds(500))
            guard !Task.isCancelled else { return }
            await notifications.reschedule(reminders)
        }
    }

    // MARK: Snapshot handling

    private func items(for purifier: Purifier) -> [FilterItem] {
        guard let id = purifier.id else { return [] }
        return (filtersByPurifier[id] ?? []).map {
            FilterItem(filter: $0, purifier: purifier, schedule: $0.schedule(now: now))
        }
    }

    private func handlePurifiers(_ result: Result<[Purifier], Error>) {
        switch result {
        case .failure(let error):
            loadError = error.localizedDescription
            isLoading = false
        case .success(let purifiers):
            self.purifiers = purifiers
            syncFilterListeners()
            if purifiers.isEmpty {
                isLoading = false
                scheduleNotifications()
            }
        }
    }

    private func syncFilterListeners() {
        let ids = Set(purifiers.compactMap(\.id))

        for (id, listener) in filterListeners where !ids.contains(id) {
            listener.remove()
            filterListeners[id] = nil
            filtersByPurifier[id] = nil
        }

        for id in ids where filterListeners[id] == nil {
            filterListeners[id] = repository.listenToFilters(purifierId: id, userId: userId) { [weak self] result in
                MainActor.assumeIsolated { self?.handleFilters(result, purifierId: id) }
            }
        }
    }

    private func handleFilters(_ result: Result<[Filter], Error>, purifierId: String) {
        switch result {
        case .failure(let error):
            loadError = error.localizedDescription
        case .success(let filters):
            filtersByPurifier[purifierId] = filters
            scheduleNotifications()
        }
        isLoading = false
    }
}
