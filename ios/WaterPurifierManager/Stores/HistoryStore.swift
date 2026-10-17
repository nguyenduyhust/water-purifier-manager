import Foundation
import Observation

@MainActor
@Observable
final class HistoryStore {
    private(set) var logs: [ActivityLog] = []
    private(set) var isLoading = false
    private(set) var hasLoaded = false
    var errorMessage: String?

    @ObservationIgnored private let repository = ActivityLogRepository()
    let userId: String

    init(userId: String) {
        self.userId = userId
    }

    /// History lives under each purifier, including ones shared with the user.
    func load(purifierIds: [String]) async {
        isLoading = true
        defer {
            isLoading = false
            hasLoaded = true
        }
        do {
            logs = try await repository.fetchRecent(userId: userId, purifierIds: purifierIds)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
