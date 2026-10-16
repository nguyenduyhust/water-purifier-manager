import FirebaseFirestore
import Foundation

/// Firestore access for `activityLogs`, matching `web/src/services/activity-log-service.ts`.
struct ActivityLogRepository {
    static let historyLimit = 50

    private var collection: CollectionReference { Firestore.firestore().collection("activityLogs") }

    func add(
        userId: String,
        type: ActivityLog.Kind,
        timestamp: Date,
        purifierId: String,
        purifierName: String,
        filterId: String? = nil,
        filterName: String? = nil,
        filterPosition: Int? = nil,
        notes: String? = nil
    ) async throws {
        // The web app stores missing optional fields as null, not absent.
        let trimmedNotes = notes?.trimmingCharacters(in: .whitespacesAndNewlines)
        try await collection.addDocument(data: [
            "userId": userId,
            "type": type.rawValue,
            "timestamp": Timestamp(date: timestamp),
            "purifierId": purifierId,
            "purifierName": purifierName,
            "filterId": filterId ?? NSNull(),
            "filterName": filterName ?? NSNull(),
            "filterPosition": filterPosition ?? NSNull(),
            "notes": trimmedNotes?.isEmpty == false ? trimmedNotes! : NSNull(),
            "createdAt": Timestamp(date: .now),
        ])
    }

    func fetchRecent(userId: String, limit: Int = historyLimit) async throws -> [ActivityLog] {
        let snapshot = try await collection
            .whereField("userId", isEqualTo: userId)
            .order(by: "timestamp", descending: true)
            .limit(to: limit)
            .getDocuments()
        return snapshot.documents.compactMap { try? $0.data(as: ActivityLog.self) }
    }
}
