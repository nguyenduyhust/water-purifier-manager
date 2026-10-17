import FirebaseFirestore
import Foundation

/// History entries, stored in `purifiers/{id}/logs` so every member sees them.
/// Matches `web/src/services/activity-log-service.ts`.
struct ActivityLogRepository {
    static let historyLimit = 50

    private var db: Firestore { Firestore.firestore() }

    private func logs(of purifierId: String) -> CollectionReference {
        db.collection("purifiers").document(purifierId).collection("logs")
    }

    func add(
        purifierId: String,
        type: ActivityLog.Kind,
        timestamp: Date,
        purifierName: String,
        actor: Actor,
        filterId: String? = nil,
        filterName: String? = nil,
        filterPosition: Int? = nil,
        notes: String? = nil
    ) async throws {
        // The web app stores missing optional fields as null, not absent.
        let trimmedNotes = notes?.trimmingCharacters(in: .whitespacesAndNewlines)
        try await logs(of: purifierId).addDocument(data: [
            "type": type.rawValue,
            "timestamp": Timestamp(date: timestamp),
            "purifierId": purifierId,
            "purifierName": purifierName,
            "filterId": filterId ?? NSNull(),
            "filterName": filterName ?? NSNull(),
            "filterPosition": filterPosition ?? NSNull(),
            "notes": trimmedNotes?.isEmpty == false ? trimmedNotes! : NSNull(),
            "actorId": actor.id,
            "actorName": actor.name,
            "createdAt": Timestamp(date: .now),
        ])
    }

    /// Recent history across the given purifiers, plus entries from the legacy
    /// top-level `activityLogs` collection written before sharing existed.
    func fetchRecent(userId: String, purifierIds: [String], limit: Int = historyLimit) async throws -> [ActivityLog] {
        let legacy = db.collection("activityLogs")
            .whereField("userId", isEqualTo: userId)
            .order(by: "timestamp", descending: true)
            .limit(to: limit)
        let queries = [legacy] + purifierIds.map {
            logs(of: $0).order(by: "timestamp", descending: true).limit(to: limit)
        }

        let entries = try await withThrowingTaskGroup(of: [ActivityLog].self) { group in
            for query in queries {
                group.addTask {
                    try await query.getDocuments().documents.compactMap { try? $0.data(as: ActivityLog.self) }
                }
            }
            return try await group.reduce(into: []) { $0 += $1 }
        }

        return Array(entries.sorted { $0.timestamp > $1.timestamp }.prefix(limit))
    }
}
