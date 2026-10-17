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
        let purifierQueries = purifierIds.map {
            logs(of: $0).order(by: "timestamp", descending: true).limit(to: limit)
        }

        async let legacyEntries = Self.fetch(legacy)
        let migratedOrNew = try await withThrowingTaskGroup(of: [ActivityLog].self) { group in
            for query in purifierQueries {
                group.addTask { try await Self.fetch(query) }
            }
            return try await group.reduce(into: []) { $0 += $1 }
        }

        // Migrated entries keep their legacy id; the per-purifier copy wins because it records who did it.
        var byId: [String: ActivityLog] = [:]
        for entry in try await legacyEntries + migratedOrNew {
            byId[entry.id ?? UUID().uuidString] = entry
        }
        return Array(byId.values.sorted { $0.timestamp > $1.timestamp }.prefix(limit))
    }

    private static func fetch(_ query: Query) async throws -> [ActivityLog] {
        try await query.getDocuments().documents.compactMap { try? $0.data(as: ActivityLog.self) }
    }
}
