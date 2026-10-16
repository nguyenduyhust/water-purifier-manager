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
    private let activityLogs = ActivityLogRepository()

    private var db: Firestore { Firestore.firestore() }
    private var purifiers: CollectionReference { db.collection("purifiers") }

    private func filters(of purifierId: String) -> CollectionReference {
        purifiers.document(purifierId).collection("filters")
    }

    func listenToPurifiers(
        userId: String,
        onChange: @escaping (Result<[Purifier], Error>) -> Void
    ) -> ListenerRegistration {
        purifiers
            .whereField("userId", isEqualTo: userId)
            .order(by: "createdAt", descending: true)
            .addSnapshotListener { snapshot, error in
                if let error {
                    onChange(.failure(error))
                    return
                }
                onChange(.success(snapshot?.documents.compactMap { try? $0.data(as: Purifier.self) } ?? []))
            }
    }

    func listenToFilters(
        purifierId: String,
        userId: String,
        onChange: @escaping (Result<[Filter], Error>) -> Void
    ) -> ListenerRegistration {
        filters(of: purifierId)
            .whereField("userId", isEqualTo: userId)
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
    func create(_ newPurifier: NewPurifier, userId: String) async throws -> String {
        let now = Timestamp(date: .now)
        let installedAt = Timestamp(date: newPurifier.installationDate)
        let purifierRef = purifiers.document()
        let typeName = newPurifier.type.name.resolved()

        // One batch so a purifier never exists without its filters.
        let batch = db.batch()
        batch.setData([
            "userId": userId,
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
                "userId": userId,
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
            userId: userId,
            type: .purifierCreated,
            timestamp: newPurifier.installationDate,
            purifierId: purifierRef.documentID,
            purifierName: newPurifier.name
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

    func delete(purifierId: String, userId: String) async throws {
        let snapshot = try await filters(of: purifierId)
            .whereField("userId", isEqualTo: userId)
            .getDocuments()

        let batch = db.batch()
        for document in snapshot.documents {
            batch.deleteDocument(document.reference)
        }
        batch.deleteDocument(purifiers.document(purifierId))
        try await batch.commit()
    }

    func replaceFilter(_ item: FilterItem, replacedAt: Date, notes: String) async throws {
        guard let filterId = item.filter.id, let purifierId = item.purifier.id else { return }

        try await filters(of: purifierId).document(filterId).updateData([
            "lastReplacedAt": Timestamp(date: replacedAt),
            "updatedAt": Timestamp(date: .now),
        ])

        try await activityLogs.add(
            userId: item.filter.userId,
            type: .filterReplaced,
            timestamp: replacedAt,
            purifierId: purifierId,
            purifierName: item.purifier.name,
            filterId: filterId,
            filterName: item.filter.name,
            filterPosition: item.filter.position,
            notes: notes
        )
    }
}
