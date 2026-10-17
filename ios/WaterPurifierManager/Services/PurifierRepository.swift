import FirebaseFirestore
import Foundation

struct NewPurifier {
    var type: PurifierType
    var name: String
    var location: String
    var installationDate: Date
    var notes: String
}

/// Firestore access for purifiers and their filters. Writes use the exact field
/// layout of `web/src/services/purifier-service.ts` so both apps share data.
struct PurifierRepository {
    /// Firestore batches hold at most 500 writes.
    private static let batchLimit = 450

    private let activityLogs = ActivityLogRepository()

    private var db: Firestore { Firestore.firestore() }
    private var purifiers: CollectionReference { db.collection("purifiers") }

    private func filters(of purifierId: String) -> CollectionReference {
        purifiers.document(purifierId).collection("filters")
    }

    /// Owned purifiers are found by `userId`, shared ones by `memberIds`; each needs its own query.
    func listenToPurifiers(
        userId: String,
        shared: Bool,
        onChange: @escaping (Result<[Purifier], Error>) -> Void
    ) -> ListenerRegistration {
        let query = shared
            ? purifiers.whereField("memberIds", arrayContains: userId)
            : purifiers.whereField("userId", isEqualTo: userId)
        return query
            .order(by: "createdAt", descending: true)
            .addSnapshotListener { snapshot, error in
                if let error {
                    onChange(.failure(error))
                    return
                }
                onChange(.success(snapshot?.documents.compactMap { try? $0.data(as: Purifier.self) } ?? []))
            }
    }

    /// Access to filters follows the parent purifier, so members query without a userId filter.
    func listenToFilters(
        purifierId: String,
        onChange: @escaping (Result<[Filter], Error>) -> Void
    ) -> ListenerRegistration {
        filters(of: purifierId)
            .order(by: "position")
            .addSnapshotListener { snapshot, error in
                if let error {
                    onChange(.failure(error))
                    return
                }
                onChange(.success(snapshot?.documents.compactMap { try? $0.data(as: Filter.self) } ?? []))
            }
    }

    @discardableResult
    func create(_ newPurifier: NewPurifier, owner: Actor) async throws -> String {
        let now = Timestamp(date: .now)
        let installedAt = Timestamp(date: newPurifier.installationDate)
        let purifierRef = purifiers.document()
        let typeName = newPurifier.type.name.resolved()

        // One batch so a purifier never exists without its filters.
        let batch = db.batch()
        batch.setData([
            "userId": owner.id,
            "typeId": newPurifier.type.id,
            "typeName": typeName,
            "name": newPurifier.name,
            "location": newPurifier.location,
            "installationDate": installedAt,
            "notes": newPurifier.notes,
            "createdAt": now,
            "updatedAt": now,
        ], forDocument: purifierRef)

        for template in newPurifier.type.filterTemplates {
            batch.setData([
                "purifierId": purifierRef.documentID,
                "userId": owner.id,
                "position": template.position,
                "name": template.name.resolved(),
                "intervalMonths": template.defaultIntervalMonths,
                "lastReplacedAt": installedAt,
                "createdAt": now,
                "updatedAt": now,
            ], forDocument: filters(of: purifierRef.documentID).document())
        }
        try await batch.commit()

        try await activityLogs.add(
            purifierId: purifierRef.documentID,
            type: .purifierCreated,
            timestamp: newPurifier.installationDate,
            purifierName: newPurifier.name,
            actor: owner
        )
        return purifierRef.documentID
    }

    func update(purifierId: String, name: String, location: String, notes: String) async throws {
        try await purifiers.document(purifierId).updateData([
            "name": name,
            "location": location,
            "notes": notes,
            "updatedAt": Timestamp(date: .now),
        ])
    }

    /// Owner only: removes the purifier with its filters, history and pending invites.
    func delete(purifierId: String, ownerId: String) async throws {
        async let filterDocs = filters(of: purifierId).getDocuments()
        async let logDocs = purifiers.document(purifierId).collection("logs").getDocuments()
        async let inviteDocs = db.collection("invites")
            .whereField("createdBy", isEqualTo: ownerId)
            .whereField("purifierId", isEqualTo: purifierId)
            .getDocuments()

        let children = try await (filterDocs.documents + logDocs.documents + inviteDocs.documents).map(\.reference)
        for start in stride(from: 0, to: children.count, by: Self.batchLimit) {
            let batch = db.batch()
            children[start..<min(start + Self.batchLimit, children.count)].forEach { batch.deleteDocument($0) }
            try await batch.commit()
        }
        // Last, so the purifier's rules still apply while its children are deleted.
        try await purifiers.document(purifierId).delete()
    }

    func replaceFilter(_ item: FilterItem, replacedAt: Date, notes: String, actor: Actor) async throws {
        guard let filterId = item.filter.id, let purifierId = item.purifier.id else { return }

        try await filters(of: purifierId).document(filterId).updateData([
            "lastReplacedAt": Timestamp(date: replacedAt),
            "updatedAt": Timestamp(date: .now),
        ])

        try await activityLogs.add(
            purifierId: purifierId,
            type: .filterReplaced,
            timestamp: replacedAt,
            purifierName: item.purifier.name,
            actor: actor,
            filterId: filterId,
            filterName: item.filter.name,
            filterPosition: item.filter.position,
            notes: notes
        )
    }
}
