import FirebaseFirestore
import Foundation

/// Removes a user's data before their account is deleted.
/// Matches `web/src/services/account-service.ts`.
struct AccountRepository {
    /// Firestore batches hold at most 500 writes.
    private static let batchLimit = 450

    private let purifiers = PurifierRepository()
    private let sharing = SharingRepository()

    private var db: Firestore { Firestore.firestore() }

    /// Deletes the purifiers the user owns (with filters, history and invites), removes them
    /// from purifiers shared with them, and deletes their remaining invites and legacy history.
    func deleteData(of userId: String) async throws {
        let all = db.collection("purifiers")
        async let owned = all.whereField("userId", isEqualTo: userId).getDocuments()
        async let shared = all.whereField("memberIds", arrayContains: userId).getDocuments()

        for document in try await owned.documents {
            try await purifiers.delete(purifierId: document.documentID, ownerId: userId)
        }
        for document in try await shared.documents {
            try await sharing.removeMember(purifierId: document.documentID, memberId: userId)
        }
        try await deleteAll(db.collection("invites").whereField("createdBy", isEqualTo: userId))
        try await deleteAll(db.collection("activityLogs").whereField("userId", isEqualTo: userId))
    }

    private func deleteAll(_ query: Query) async throws {
        let refs = try await query.getDocuments().documents.map(\.reference)
        for start in stride(from: 0, to: refs.count, by: Self.batchLimit) {
            let batch = db.batch()
            refs[start..<min(start + Self.batchLimit, refs.count)].forEach { batch.deleteDocument($0) }
            try await batch.commit()
        }
    }
}
